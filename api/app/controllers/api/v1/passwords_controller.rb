module Api
  module V1
    class PasswordsController < ApplicationController
      def update
        if current_user.authenticate(params[:current_password])
          if current_user.update(password: params[:new_password], password_confirmation: params[:new_password_confirmation])
            render_success(message: 'Password updated successfully')
          else
            render_error(message: 'Failed to update password', errors: current_user.errors.full_messages)
          end
        else
          render_error(message: 'Incorrect current password', status: :unauthorized)
        end
      end
    end
  end
end
