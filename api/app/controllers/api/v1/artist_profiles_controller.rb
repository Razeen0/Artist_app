module Api
  module V1
    class ArtistProfilesController < ApplicationController
      include Crudable
      load_and_authorize_resource

      private

      def artist_profile_params
        params.require(:artist_profile).permit(:bio, :experience_years, :base_price, :city)
      end

      def resource_params
        artist_profile_params
      end

      def collection
        ArtistProfile.all.order(created_at: :desc)
      end
    end
  end
end
