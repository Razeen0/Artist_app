# frozen_string_literal: true

module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_action :authorize_request, only: %i[create refresh]

      # POST /api/v1/login
      def create
        user = User.find_by(email: login_params[:email])

        unless user&.authenticate(login_params[:password])
          return render_error(message: "Invalid credentials", status: :unauthorized)
        end

        unless user.status == "active"
          return render_error(message: "Account is not active", status: :forbidden)
        end

        render_success(data: build_auth_payload(user), message: "Login successful")
      end

      # DELETE /api/v1/logout
      def destroy
        # JWT is stateless — the client is responsible for discarding the token.
        # To support server-side invalidation, add a token denylist here.
        render_success(message: "Logged out successfully")
      end

      # GET /api/v1/me
      def me
        render_success(
          data: current_user.slice(:id, :name, :email, :role),
          message: "Current user retrieved successfully"
        )
      end

      # PATCH /api/v1/profile
      def update_profile
        if current_user.update(profile_params)
          render_success(
            data: current_user.slice(:id, :name, :email, :role),
            message: "Profile updated successfully"
          )
        else
          render_error(
            message: "Profile update failed",
            status: :unprocessable_entity,
            errors: current_user.errors.full_messages
          )
        end
      end

      # DELETE /api/v1/profile
      def delete_profile
        user = current_user

        ActiveRecord::Base.transaction do
          # Cancel all pending bookings placed by this customer
          Booking.where(customer_id: user.id, status: "pending")
                 .update_all(status: "cancelled")

          # Cancel all pending bookings received by this artist
          if user.artist? && user.artist_profile
            Booking.where(artist_profile_id: user.artist_profile.id, status: "pending")
                   .update_all(status: "cancelled")
          end

          user.update!(status: "inactive")
        end

        render_success(message: "Account deleted successfully")
      end

      # POST /api/v1/refresh
      def refresh
        decoded = JsonWebToken.decode(extract_bearer_token)

        unless decoded[:type] == "refresh"
          return render_error(message: "Invalid token type", status: :unauthorized)
        end

        user = User.find(decoded[:user_id])

        unless user.status == "active"
          return render_error(message: "Account is not active", status: :forbidden)
        end

        new_access_token = JsonWebToken.encode({ user_id: user.id, type: "access" }, 1.hour.from_now)

        render_success(data: { token: new_access_token }, message: "Token refreshed successfully")
      rescue JWT::DecodeError, ActiveRecord::RecordNotFound
        render_error(message: "Invalid or expired refresh token", status: :unauthorized)
      end

      private

      # Builds the JSON payload returned on successful authentication.
      def build_auth_payload(user)
        access_token  = JsonWebToken.encode({ user_id: user.id, type: "access" },  1.hour.from_now)
        refresh_token = JsonWebToken.encode({ user_id: user.id, type: "refresh" }, 7.days.from_now)

        {
          token:         access_token,
          refresh_token: refresh_token,
          expires_at:    1.hour.from_now.strftime("%m-%d-%Y %H:%M"),
          id:            user.id,
          name:          user.name,
          email:         user.email,
          role:          user.role
        }
      end

      def profile_params
        params.permit(:name, :phone, :address, :preferences, :password, :password_confirmation)
      end

      def login_params
        params.permit(:email, :password)
      end
    end
  end
end
