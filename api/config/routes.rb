Rails.application.routes.draw do
  # System Health
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      # Authentication
      post "login", to: "sessions#create"
      post "signup", to: "registrations#create"
      patch "password/update", to: "passwords#update"

      # Dashboard
      get "dashboard", to: "dashboard#index"

      # Resources
      resources :users
      resources :artist_profiles
      resources :services
      resources :bookings
      resources :availabilities
      resources :reviews
      resources :payments
    end
  end
end
