class ServiceSerializer < ActiveModel::Serializer
  attributes :id, :artist_profile_id, :name, :description, :price, :duration_minutes, :created_at, :updated_at
  belongs_to :artist_profile
end
