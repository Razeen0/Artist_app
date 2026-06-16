# frozen_string_literal: true

class BookingSerializer < ActiveModel::Serializer
  attributes :id,
             :booking_date,
             :start_time,
             :end_time,
             :status,
             :total_amount,
             :created_at,
             :artist,
             :service,
             :customer

  def total_amount
    object.total_amount.to_f
  end

  def start_time
    object.start_time&.strftime("%H:%M")
  end

  def end_time
    object.end_time&.strftime("%H:%M")
  end



  # Inline summary of the artist who owns the booking, avoids embedding a full serializer.
  def artist
    user = object.artist_profile&.user
    return nil unless user

    { id: user.id, name: user.name, email: user.email }
  end

  # Inline summary of the booked service.
  def service
    svc = object.service
    return nil unless svc

    { id: svc.id, name: svc.name, price: svc.price.to_f, duration_minutes: svc.duration_minutes }
  end

  # Inline summary of the customer who placed the booking.
  def customer
    c = object.customer
    return nil unless c

    { id: c.id, name: c.name, email: c.email }
  end
end