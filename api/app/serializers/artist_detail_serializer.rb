# frozen_string_literal: true

class ArtistDetailSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :email,
             :city,
             :bio,
             :experience_years,
             :base_price,
             :is_approved,
             :rating,
             :created_at

  has_many :services, serializer: ServiceDetailSerializer
  has_many :reviews,  serializer: ReviewDetailSerializer

  # Delegated through the ArtistProfile model's `delegate :name, :email, to: :user`
  def name
    object.name
  end

  def email
    object.email
  end
end
