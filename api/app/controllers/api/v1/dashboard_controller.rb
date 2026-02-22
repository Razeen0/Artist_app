module Api
  module V1
    class DashboardController < ApplicationController
      def index
        stats = if current_user.role == 'admin'
                  {
                    total_users: User.count,
                    total_artists: ArtistProfile.count,
                    total_bookings: Booking.count,
                    total_payments: Payment.sum(:amount)
                  }
                elsif current_user.role == 'artist'
                  profile = current_user.artist_profile
                  {
                    total_bookings: Booking.where(artist_profile_id: profile&.id).count,
                    total_services: Service.where(artist_profile_id: profile&.id).count,
                    total_revenue: Payment.joins(:booking).where(bookings: { artist_profile_id: profile&.id }).sum(:amount)
                  }
                else
                  {
                    total_bookings: Booking.where(customer_id: current_user.id).count,
                    total_spent: Payment.joins(:booking).where(bookings: { customer_id: current_user.id }).sum(:amount)
                  }
                end

        render_success(
          data: { stats: stats },
          message: "Dashboard data retrieved successfully"
        )
      end

      private

      # No check_admin before_action needed here as we want all logged-in users to see their dashboard
    end
  end
end
