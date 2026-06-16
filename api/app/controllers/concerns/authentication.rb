# frozen_string_literal: true

module Authentication
  extend ActiveSupport::Concern

  included do
    before_action :authorize_request
  end

  def current_user
    @current_user
  end

  def current_user?
    @current_user.present?
  end

  private

  def authorize_request
    @decoded      = JsonWebToken.decode(extract_bearer_token)
    @current_user = User.find(@decoded[:user_id])
  rescue ActiveRecord::RecordNotFound
    render_error(message: "User not found", status: :unauthorized)
  rescue JWT::DecodeError => e
    render_error(message: "Invalid token", status: :unauthorized, errors: [e.message])
  end

  # Strips "Bearer " from the Authorization header and returns the raw token.
  def extract_bearer_token
    request.headers["Authorization"]&.split(" ")&.last
  end
end
