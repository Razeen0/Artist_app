# frozen_string_literal: true

module Api
  module V1
    class BookingsController < ApplicationController
      load_and_authorize_resource includes: [:service, :artist_profile, :customer], except: [:create]

      # POST /api/v1/bookings
      def create
        @booking = Booking.new(booking_params)

        @booking.customer_id = current_user.id if current_user.customer?

        return render_error(message: "Service is required") if @booking.service_id.blank?

        service = Service.find(@booking.service_id)
        @booking.total_amount      = service.price
        @booking.artist_profile_id = service.artist_profile_id

        authorize! :create, @booking

        return render_error(message: "This time slot is not available") if time_slot_conflict?

        if @booking.save
          render_success(data: @booking, status: :created)
        else
          render_error(errors: @booking.errors.full_messages)
        end
      rescue ActiveRecord::RecordNotUnique
        render_error(message: "This time slot is already booked")
      end

      # GET /api/v1/bookings
      def index
        bookings = paginate(collection)
        render_paginated_success(bookings, message: "Bookings retrieved successfully")
      end

      # GET /api/v1/bookings/stats
      def stats
        scoped = collection

        render_success(
          data: {
            total:     scoped.count,
            pending:   scoped.where(status: "pending").count,
            confirmed: scoped.where(status: "confirmed").count,
            completed: scoped.where(status: "completed").count,
            revenue:   scoped.where(status: "completed").sum(:total_amount)
          },
          message: "Booking stats fetched"
        )
      end

      # GET /api/v1/bookings/:id
      def show
        render_success(data: @booking, message: "Booking retrieved successfully")
      end

      # GET /api/v1/bookings/my_bookings
      def my_bookings
        return render_error(message: "Only customers allowed", status: :forbidden) unless current_user.customer?

        bookings = paginate(Booking.where(customer_id: current_user.id).order(booking_date: :desc))
        render_paginated_success(bookings, message: "Your bookings retrieved successfully")
      end

      # GET /api/v1/bookings/artist_bookings
      def artist_bookings
        return render_error(message: "Only artists allowed", status: :forbidden) unless current_user.artist?

        profile = current_user.artist_profile
        return render_not_found("Artist profile") unless profile

        bookings = paginate(Booking.where(artist_profile_id: profile.id).order(booking_date: :desc))
        render_paginated_success(bookings, message: "Artist bookings retrieved successfully")
      end

      # DELETE /api/v1/bookings/:id
      def destroy
        @booking.destroy
        render_success(message: "Booking deleted successfully")
      end

      # PATCH /api/v1/bookings/:id/cancel
      def cancel
        return render_success(message: "Booking already cancelled") if @booking.status == "cancelled"

        unless @booking.status == "pending"
          return render_error(
            message: "Only pending bookings can be cancelled",
            status: :unprocessable_entity
          )
        end

        Booking.transaction do
          @booking.update!(status: "cancelled")
          Rails.logger.info "[BookingsController#cancel] Artist #{@booking.artist_profile_id} notified of cancellation"
          # TODO: Enqueue a BookingCancellationNotificationJob here
        end

        render_success(message: "Booking cancelled successfully")
      end

      private

      def booking_params
        params.require(:booking).permit(:service_id, :booking_date, :start_time, :end_time)
      end

      # Checks whether the artist has an overlapping booking in the same time slot.
      def time_slot_conflict?
        Booking.where(
          artist_profile_id: @booking.artist_profile_id,
          booking_date:      @booking.booking_date
        ).where(
          "start_time < ? AND end_time > ?",
          @booking.end_time,
          @booking.start_time
        ).exists?
      end

      # Scopes the booking list based on the current user's role, with optional status filter.
      def collection
        base = Booking.includes(:service, :artist_profile, :payment, :customer)

        scoped = case
                 when current_user.admin?  then base
                 when current_user.artist? then base.where(artist_profile_id: current_user.artist_profile&.id)
                 else                           base.where(customer_id: current_user.id)
                 end

        scoped = scoped.where(status: params[:status]) if params[:status].present?
        scoped.order(created_at: :desc)
      end
    end
  end
end
