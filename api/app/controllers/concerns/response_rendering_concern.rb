# frozen_string_literal: true

module ResponseRenderingConcern
  extend ActiveSupport::Concern

  def render_success(data: nil, message: "Success", status: :ok, serializer: nil)
    serialized_data = serialize_data(data, serializer)
    render json: { success: true, message: message, data: serialized_data }, status: status
  end

  def render_error(message: "Error", status: :unprocessable_entity, errors: nil)
    render json: { success: false, message: message, errors: errors }, status: status
  end

  def render_not_found(resource_name = "Resource")
    render_error(message: "#{resource_name} not found", status: :not_found)
  end

  private

  def serialize_data(data, serializer = nil)
    return nil if data.nil?

    options = if serializer
                data.respond_to?(:to_ary) ? { each_serializer: serializer } : { serializer: serializer }
              else
                {}
              end

    ActiveModelSerializers::SerializableResource.new(data, options)
  end
end
