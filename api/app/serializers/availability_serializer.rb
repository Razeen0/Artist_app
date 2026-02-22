class AvailabilitySerializer < ActiveModel::Serializer
  attributes :id, :artist_profile_id, :available_date, :start_time, :end_time, :is_booked, :created_at, :updated_at
  belongs_to :artist_profile
end
