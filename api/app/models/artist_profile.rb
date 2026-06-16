# frozen_string_literal: true

class ArtistProfile < ApplicationRecord
  belongs_to :user

  has_many :services, dependent: :destroy
  has_many :availabilities, dependent: :destroy
  has_many :bookings, dependent: :destroy
  has_many :reviews, dependent: :destroy

  validates :bio, length: { maximum: 2000 }, allow_blank: true
  validates :city, length: { maximum: 100 }, allow_blank: true
  validates :base_price, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :experience_years, numericality: { greater_than_or_equal_to: 0, only_integer: true }, allow_nil: true

  scope :approved, -> { where(is_approved: true) }
  scope :with_associations, -> { includes(:user, :services, :bookings, :reviews) }

  # Delegates user-level identity to the associated user record
  delegate :name, :email, to: :user, allow_nil: true
end
