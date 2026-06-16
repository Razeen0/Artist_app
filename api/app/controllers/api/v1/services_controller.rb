# frozen_string_literal: true

module Api
  module V1
    class ServicesController < ApplicationController
      include Crudable
      load_and_authorize_resource except: %i[create index artist_services]

      # POST /api/v1/services
      def create
        @resource = Service.new(resource_params)

        if current_user.artist?
          profile = current_user.artist_profile ||
                    current_user.create_artist_profile(bio: "", city: "", experience_years: 0, base_price: 0, is_approved: false)
          @resource.artist_profile_id = profile.id
        end

        authorize! :create, @resource

        if @resource.save
          render_success(data: @resource, status: :created)
        else
          render_error(errors: @resource.errors.full_messages)
        end
      end

      # GET /api/v1/artists/:id/services
      def artist_services
        artist = ArtistProfile.find(params[:id])
        services = artist.services.ordered_by_name

        render_success(data: services, message: "Artist services retrieved successfully")
      end

      private

      def service_params
        params.require(:service).permit(
          :artist_profile_id, :service_category_id,
          :name, :description, :duration_minutes, :price
        )
      end

      def resource_params
        service_params
      end

      def allowed_sort_columns
        %w[name price duration_minutes created_at]
      end

      def collection
        base = Service.includes(:artist_profile, :service_category)

        if current_user.artist? && current_user.artist_profile
          base.for_artist(current_user.artist_profile.id)
        else
          base
        end.ordered_by_name
      end
    end
  end
end
