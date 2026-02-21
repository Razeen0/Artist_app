module ResponseRenderingConcern
  extend ActiveSupport::Concern

  def render_success(data: nil, message: 'Success', status: :ok)
    render json: { success: true, message: message, data: data }, status: status
  end

  def render_error(message: 'Error', status: :unprocessable_entity, errors: nil)
    render json: { success: false, message: message, errors: errors }, status: status
  end
end
