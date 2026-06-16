# frozen_string_literal: true

class Service < ApplicationRecord
  belongs_to :artist_profile
  belongs_to :service_category, optional: true

  validates :name, presence: true, length: { maximum: 100 }
  validates :price, presence: true, numericality: { greater_than: 0 }
  validates :duration_minutes, presence: true, numericality: { greater_than: 0, only_integer: true }
  validates :description, length: { maximum: 1000 }, allow_blank: true

  scope :ordered_by_name, -> { order(name: :asc) }
  scope :for_artist, ->(profile_id) { where(artist_profile_id: profile_id) }
end
