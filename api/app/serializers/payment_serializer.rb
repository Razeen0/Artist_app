class PaymentSerializer < ActiveModel::Serializer
  attributes :id, :booking_id, :amount, :currency, :payment_status, :stripe_payment_intent_id, :created_at, :updated_at
  belongs_to :booking
end
