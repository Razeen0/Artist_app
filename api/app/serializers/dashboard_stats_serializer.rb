class DashboardStatsSerializer < ActiveModel::Serializer
  attributes :total_users, :total_artists, :total_bookings, :total_payments
end
