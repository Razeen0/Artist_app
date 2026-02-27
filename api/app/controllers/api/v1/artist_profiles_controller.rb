module Api
  module V1
    class ArtistProfilesController < ApplicationController
      include Crudable
      load_and_authorize_resource

      def index
        authorize! :read, ArtistProfile
        profiles = paginate(collection)
        render json: {
          success: true,
          message: 'Artist profiles retrieved successfully',
          data: profiles.map { |p| serialize_profile(p) },
          meta: pagination_meta(profiles)
        }
      end

      def show
        authorize! :read, @resource
        render json: { success: true, message: 'Success', data: serialize_profile(@resource) }
      end

      private

      def serialize_profile(profile)
        profile.as_json(
          include: {
            user: { only: [:id, :email, :role] },
            services: { only: [:id, :name, :description, :price, :duration_minutes, :artist_profile_id, :service_category_id] }
          }
        ).merge(
          'bookings_count' => profile.bookings.count,
          'reviews_count'  => profile.reviews.count
        )
      end

      def artist_profile_params
        params.require(:artist_profile).permit(:name, :bio, :experience_years, :base_price, :city)
      end

      def resource_params
        artist_profile_params
      end

      def collection
        ArtistProfile.includes(:user, :services, :bookings, :reviews).order(created_at: :desc)
      end
    end
  end
end

