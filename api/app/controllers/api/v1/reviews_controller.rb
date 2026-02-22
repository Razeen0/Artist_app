module Api
  module V1
    class ReviewsController < ApplicationController
      include Crudable
      load_and_authorize_resource

      private

      def review_params
        params.require(:review).permit(:artist_profile_id, :booking_id, :rating, :comment)
      end

      def resource_params
        review_params
      end

      def collection
        Review.all.order(created_at: :desc)
      end
    end
  end
end
