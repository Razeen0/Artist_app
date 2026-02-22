class ReviewSerializer < ActiveModel::Serializer
  attributes :id, :booking_id, :artist_profile_id, :customer_id, :rating, :comment, :created_at, :updated_at
  belongs_to :booking
  belongs_to :artist_profile
end
