# frozen_string_literal: true

module Api
  module V1
    class ReviewsController < ApplicationController
      include Crudable
      load_and_authorize_resource

      # POST /api/v1/reviews
      def create
        booking = Booking.find_by(id: review_params[:booking_id])
        return render_not_found("Booking") unless booking
        return render_error(message: "Not authorized", status: :forbidden)    unless booking.customer_id == current_user.id
        return render_error(message: "You can only review completed bookings") unless booking.status == "completed"

        @review                   = Review.new(review_params)
        @review.customer_id       = current_user.id
        @review.artist_profile_id = booking.artist_profile_id

        authorize! :create, @review

        if @review.save
          render_success(data: @review, serializer: ReviewDetailSerializer, status: :created)
        else
          render_error(errors: @review.errors.full_messages)
        end
      rescue ActiveRecord::RecordNotUnique
        render_error(message: "Review already exists for this booking")
      end

      # GET /api/v1/reviews
      def index
        reviews = paginate(scope_for_current_user)
        render_paginated_success(reviews, serializer: ReviewDetailSerializer, message: "Reviews retrieved successfully")
      end

      # GET /api/v1/reviews/my_reviews
      def my_reviews
        return render_error(message: "Only customers allowed", status: :forbidden) unless current_user.customer?

        reviews = paginate(base_scope.where(customer_id: current_user.id))
        render_paginated_success(reviews, serializer: ReviewDetailSerializer, message: "Your reviews retrieved successfully")
      end

      private

      def review_params
        params.require(:review).permit(:booking_id, :rating, :comment)
      end

      def resource_params
        review_params
      end

      # Returns a pre-joined base scope to avoid N+1 on artist_profile/user
      def base_scope
        Review.includes(artist_profile: :user).order(created_at: :desc)
      end

      # Filters the review scope based on who is asking
      def scope_for_current_user
        if current_user.admin?
          base_scope
        elsif current_user.artist?
          base_scope.where(artist_profile_id: current_user.artist_profile.id)
        elsif params[:artist_profile_id].present?
          base_scope.where(artist_profile_id: params[:artist_profile_id])
        else
          base_scope.where(customer_id: current_user.id)
        end
      end

      def collection
        scope_for_current_user
      end
    end
  end
end
