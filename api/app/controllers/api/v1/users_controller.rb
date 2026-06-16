# frozen_string_literal: true

module Api
  module V1
    class UsersController < ApplicationController
      include Crudable

      # GET /api/v1/users
      def index
        authorize! :read, model_class

        resources = paginate(sort(collection))

        render_paginated_success(
          resources,
          message: "#{model_class.name.pluralize} retrieved successfully",
          extra_meta: user_list_meta
        )
      end

      private

      def collection
        users = User.order(created_at: :desc)
        users = users.where(role: params[:role]) if params[:role].present?
        users
      end

      def allowed_sort_columns
        %w[name email created_at role status]
      end

      def user_params
        permitted = %i[email password password_confirmation name phone address loyalty_status preferences]
        permitted_nested = [artist_profile_attributes: %i[id city bio is_approved]]

        all_params = permitted + permitted_nested
        all_params += %i[role status] if current_user&.admin?

        params.require(:user).permit(all_params)
      end

      def resource_params
        user_params
      end

      # Extra metadata included in the user list response
      def user_list_meta
        base = collection
        {
          active_count:       base.where(status: ["active", nil, ""]).count,
          new_this_week_count: base.where("created_at >= ?", 1.week.ago).count
        }
      end
    end
  end
end
