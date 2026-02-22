module Crudable
  extend ActiveSupport::Concern

  included do
    before_action :set_resource, only: [:show, :update, :destroy]
  end

  def index
    authorize! :read, model_class
    resources = paginate(sort(collection))
    render_paginated_success(resources, message: "#{model_class.name.pluralize} retrieved successfully")
  end

  def show
    authorize! :read, @resource
    render_success(data: @resource)
  end

  def create
    authorize! :create, model_class
    @resource = model_class.new(resource_params)
    if @resource.save
      render_success(data: @resource, status: :created)
    else
      render_error(errors: @resource.errors.full_messages)
    end
  end

  def update
    authorize! :update, @resource
    if @resource.update(resource_params)
      render_success(data: @resource)
    else
      render_error(errors: @resource.errors.full_messages)
    end
  end

  def destroy
    authorize! :destroy, @resource
    @resource.destroy
    render_success(message: "#{model_class.name} deleted successfully")
  end

  private
  
  def collection
    model_class.all
  end

  def model_class
    controller_name.classify.constantize
  end

  def set_resource
    @resource = model_class.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render_error(message: "#{model_class.name} not found", status: :not_found)
  end
end
