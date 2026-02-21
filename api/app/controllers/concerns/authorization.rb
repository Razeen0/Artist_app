module Authorization
  extend ActiveSupport::Concern

  included do
    rescue_from CanCan::AccessDenied do |exception|
      render_error(message: 'Forbidden', status: :forbidden, errors: [exception.message])
    end
  end
end
