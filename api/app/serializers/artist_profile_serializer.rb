# frozen_string_literal: true

class ArtistProfileSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :email,
             :city,
             :bio,
             :experience_years,
             :base_price,
             :is_approved,
             :rating,
             :services_count,
             :bookings_count,
             :reviews_count,
             :created_at

  # Delegated to the associated user via the ArtistProfile model delegate
  def name
    object.name
  end

  def email
    object.email
  end

  # Use .size instead of .count to avoid N+1 queries when the association
  # has already been eager-loaded (e.g. via .includes(:services)).
  def services_count
    object.services.size
  end

  def bookings_count
    object.bookings.size
  end

  def reviews_count
    object.reviews.size
  end
end
