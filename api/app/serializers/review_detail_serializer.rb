# frozen_string_literal: true

class ReviewDetailSerializer < ActiveModel::Serializer
  attributes :id,
             :rating,
             :comment,
             :artist_name,
             :customer_id,
             :created_at

  # Returns the display name of the artist who received the review.
  # Falls back to the artist's email if no name is set.
  def artist_name
    profile = object.artist_profile
    profile&.name.presence || profile&.email
  end
end