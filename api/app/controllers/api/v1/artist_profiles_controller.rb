# frozen_string_literal: true

module Api
  module V1
    class ArtistProfilesController < ApplicationController
      include Crudable
      load_and_authorize_resource except: [:index]

      # GET /api/v1/artists
      def index
        artists = ArtistProfile
                    .approved
                    .includes(:services, :user)
                    .then { |scope| apply_search(scope) }
                    .order(created_at: :desc)

        render_paginated_success(artists, message: "Artists retrieved successfully")
      end

      # GET /api/v1/artists/:id
      def show
        authorize! :read, ArtistProfile

        artist = ArtistProfile.includes(:user, :services, :reviews).find(params[:id])

        render_success(
          data: artist,
          serializer: ArtistDetailSerializer,
          message: "Artist details retrieved successfully"
        )
      end

      private

      def artist_profile_params
        params.require(:artist_profile).permit(:name, :bio, :experience_years, :base_price, :city, :is_approved)
      end

      def resource_params
        artist_profile_params
      end

      def allowed_sort_columns
        %w[created_at base_price experience_years]
      end

      def collection
        ArtistProfile.with_associations.order(created_at: :desc)
      end

      # Applies an optional full-text search across user name, city, and bio.
      def apply_search(scope)
        return scope if params[:search].blank?

        scope.joins(:user).where(
          "users.name ILIKE :q OR artist_profiles.city ILIKE :q OR artist_profiles.bio ILIKE :q",
          q: "%#{params[:search]}%"
        )
      end
    end
  end
end
