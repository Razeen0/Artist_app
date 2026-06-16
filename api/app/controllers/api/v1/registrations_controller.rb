# frozen_string_literal: true

module Api
  module V1
    class RegistrationsController < ApplicationController
      skip_before_action :authorize_request, only: :create

      # POST /api/v1/signup
      def create
        role = params.dig(:user, :is_artist) ? "artist" : "customer"

        @user = User.new(user_params.merge(role: role))

        if @user.save
          # Artist profile is auto-provisioned by the User model's after_create callback.
          # No manual create_artist_profile call needed here.
          token = JsonWebToken.encode(user_id: @user.id)

          render_success(
            data: { user: @user.slice(:id, :name, :email, :role), token: token },
            message: "Account created successfully",
            status: :created
          )
        else
          render_error(message: "Registration failed", errors: @user.errors.full_messages)
        end
      end

      private

      def user_params
        params.require(:user).permit(:name, :email, :password, :password_confirmation)
      end
    end
  end
end
