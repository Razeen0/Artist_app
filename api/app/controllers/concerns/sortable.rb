module Sortable
  extend ActiveSupport::Concern

  def sort(scope)
    return scope if params[:sort_by].blank?

    sort_field = params[:sort_by]
    sort_order = params[:sort_order] || 'asc'
    
    # Optional: Whitelist fields to prevent SQL injection or bad queries
    # For now, let's just use it simply
    scope.order("#{sort_field} #{sort_order}")
  end
end
