class ArtistProfileSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :bio, :city, :experience_years, :base_price, :is_approved, :approved_at, :created_at, :updated_at
  belongs_to :user
  has_many :services
  has_many :availabilities
  has_many :bookings
  has_many :reviews
end
