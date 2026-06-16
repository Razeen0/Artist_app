# frozen_string_literal: true

class Booking < ApplicationRecord
  belongs_to :service
  belongs_to :artist_profile
  belongs_to :customer, class_name: "User", foreign_key: :customer_id

  has_one :payment, dependent: :destroy
  has_one :review, dependent: :destroy

  STATUSES = %w[pending confirmed completed cancelled].freeze

  validates :booking_date, presence: true
  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, inclusion: { in: STATUSES }
  validates :total_amount, numericality: { greater_than: 0 }, allow_nil: true

  before_validation :set_default_status, on: :create

  private

  def set_default_status
    self.status ||= "pending"
  end
end