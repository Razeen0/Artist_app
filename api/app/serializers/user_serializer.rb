class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :role, :status, :created_at, :updated_at
  has_one :artist_profile
end
