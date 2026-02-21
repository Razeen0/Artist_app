class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)
    
    if user.role == 'admin'
      can :manage, :all
    elsif user.role == 'artist'
      can :manage, User, id: user.id
      can :manage, ArtistProfile, user_id: user.id
      can :manage, Service, artist_profile: { user_id: user.id }
      can :read, :all
    else
      can :manage, User, id: user.id
      can :read, :all
      can :manage, Booking, customer_id: user.id
    end
  end
end
