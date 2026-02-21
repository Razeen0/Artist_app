class User < ApplicationRecord
  has_secure_password
  
  has_one :artist_profile, dependent: :destroy
  has_many :bookings, foreign_key: :customer_id, dependent: :destroy
  has_many :reviews, foreign_key: :customer_id, dependent: :destroy

  ROLES = %w[admin artist customer].freeze
  STATUSES = %w[active inactive suspended].freeze

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, inclusion: { in: ROLES }
  validates :status, inclusion: { in: STATUSES }
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  def admin?
    role == 'admin'
  end

  def artist?
    role == 'artist'
  end

  def customer?
    role == 'customer'
  end
end
