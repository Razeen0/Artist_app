module Api
  module V1
    class BookingsController < ApplicationController
      include Crudable
      load_and_authorize_resource

      def index
        @bookings = paginate(collection)
        render_paginated_success(@bookings, message: "Bookings retrieved successfully")
      end

      private

      def booking_params
        params.require(:booking).permit(:artist_profile_id, :service_id, :booking_date, :start_time, :end_time, :total_amount, :status)
      end

      def resource_params
        booking_params
      end

      def collection
        if current_user.role == 'admin'
          Booking.all
        elsif current_user.role == 'artist'
          Booking.where(artist_profile_id: current_user.artist_profile&.id)
        else
          Booking.where(customer_id: current_user.id)
        end.order(booking_date: :desc)
      end
    end
  end
end
