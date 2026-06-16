# frozen_string_literal: true

class ApplicationController < ActionController::API
  include ActionController::Cookies
  include ResponseRenderingConcern
  include Authentication
  include Authorization
  include Paginatable
  include Sortable

  # ---------------------------------------------------------------------------
  # Global error handlers
  # ---------------------------------------------------------------------------

  rescue_from ActiveRecord::RecordNotFound do |e|
    render_error(message: "Resource not found", status: :not_found, errors: [e.message])
  end

  rescue_from ActiveRecord::RecordInvalid do |e|
    render_error(message: "Validation failed", status: :unprocessable_entity, errors: e.record.errors.full_messages)
  end

  rescue_from ArgumentError do |e|
    render_error(message: "Invalid argument", status: :bad_request, errors: [e.message])
  end

  rescue_from StandardError do |e|
    Rails.logger.error "[#{e.class}] #{e.message}\n#{e.backtrace.first(5).join("\n")}"
    render_error(message: "Internal server error", status: :internal_server_error)
  end

  # ---------------------------------------------------------------------------
  # Role-based access helpers
  # ---------------------------------------------------------------------------

  # Generic role guard — call as `before_action -> { authorize_role!(:admin) }`.
  def authorize_role!(*roles)
    allowed = roles.any? { |role| current_user&.public_send(:"#{role}?") }
    render_error(message: "Forbidden", status: :forbidden) unless allowed
  end

  def authorize_admin
    authorize_role!(:admin)
  end

  def authorize_artist
    return if current_user&.approved_artist?

    render_error(message: "Access denied. Artist approval required.", status: :forbidden)
  end
end
