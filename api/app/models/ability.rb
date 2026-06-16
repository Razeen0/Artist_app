# frozen_string_literal: true

class Ability
  include CanCan::Ability

  def initialize(user)
    # Default to an unauthenticated guest user with no permissions
    user ||= User.new

    if user.admin?
      can :manage, :all

    elsif user.artist?
      define_artist_abilities(user)

    elsif user.customer?
      define_customer_abilities(user)
    end

    # Globally readable resources (all authenticated roles)
    can :read, Organization
    can :read, ServiceCategory
  end

  private

  def define_artist_abilities(user)
    # Own user account
    can :manage, User, id: user.id

    # Own artist profile
    can :manage, ArtistProfile, user_id: user.id

    # Own services
    can :manage, Service, artist_profile: { user_id: user.id }
    can :create, Service
    can :read, Service

    # Bookings received as an artist
    can %i[read update destroy], Booking, artist_profile: { user_id: user.id }

    # Reviews received
    can :read, Review, artist_profile: { user_id: user.id }

    # Own availabilities
    can :manage, Availability, artist_profile: { user_id: user.id }

    # Dashboard access
    can :read, :dashboard
  end

  def define_customer_abilities(user)
    # Own account
    can :manage, User, id: user.id

    # Own bookings (full lifecycle)
    can :manage, Booking, customer_id: user.id

    # Browse artists, services, availabilities
    can :read, ArtistProfile
    can :read, Service
    can :read, Availability

    # Own reviews
    can :manage, Review, customer_id: user.id

    # Dashboard access
    can :read, :dashboard
  end
end
