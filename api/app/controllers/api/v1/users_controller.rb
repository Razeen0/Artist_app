module Api
  module V1
    class UsersController < ApplicationController
      include Crudable

      private

      def collection
        User.order(created_at: :desc)
      end

      def user_params
        permitted_params = [:email, :password, :password_confirmation]
        permitted_params += [:role, :status] if current_user&.admin?
        params.require(:user).permit(permitted_params)
      end

      def resource_params
        user_params
      end
    end
  end
end
