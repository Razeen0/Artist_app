class BookingSerializer < ActiveModel::Serializer
  attributes :id, :artist_profile_id, :service_id, :customer_id, :booking_date, :start_time, :end_time, :status, :total_amount, :stripe_payment_intent_id, :created_at, :updated_at
  belongs_to :artist_profile
  belongs_to :service
  has_one :payment
  has_one :review
end
