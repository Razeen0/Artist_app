# frozen_string_literal: true

module Sortable
  extend ActiveSupport::Concern

  # Override in a controller to allow sorting on specific columns.
  # Example:  def allowed_sort_columns = %w[name created_at price]
  ALLOWED_SORT_DIRECTIONS = %w[asc desc].freeze

  def sort(scope)
    return scope if params[:sort_by].blank?

    column    = sanitize_sort_column(params[:sort_by])
    direction = sanitize_sort_direction(params[:sort_order])

    return scope if column.nil?

    scope.order("#{column} #{direction}")
  end

  private

  def allowed_sort_columns
    # Subclasses should override this to declare a safe whitelist.
    # Returning nil disables sorting entirely for safety.
    nil
  end

  def sanitize_sort_column(column)
    return nil if allowed_sort_columns.nil?

    allowed_sort_columns.include?(column.to_s) ? column : nil
  end

  def sanitize_sort_direction(direction)
    ALLOWED_SORT_DIRECTIONS.include?(direction.to_s.downcase) ? direction.downcase : "asc"
  end
end
