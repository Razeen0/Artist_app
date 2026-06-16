# frozen_string_literal: true

# This seed file is idempotent, transaction-safe, and protected against
# accidental production execution.

class DatabaseSeeder
  CITIES = [
    "New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
    "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"
  ].freeze

  ARTIST_DATA = [
    { name: "Aria Vance",     bio: "Visual storyteller specializing in digital portraiture and cyberpunk concept art.", skills: ["Digital Portrait", "Concept Art"] },
    { name: "Marcus Stone",   bio: "Muralist and street artist with over a decade of experience transforming public spaces.", skills: ["Mural Design", "Graffiti Art"] },
    { name: "Elena Rostova",  bio: "Classical oil painter focusing on atmospheric landscapes and modern realism.", skills: ["Oil Painting", "Landscape Art"] },
    { name: "Kaito Tanaka",   bio: "Calligrapher and ink wash artist merging traditional Japanese techniques with modern design.", skills: ["Traditional Calligraphy", "Ink Wash"] },
    { name: "Sarah Jenkins",  bio: "Tattoo artist with a passion for geometric designs, dotwork, and micro-realism.", skills: ["Custom Tattoo Flash", "Geometric Art"] },
    { name: "Diego Rivera",   bio: "Illustrator and graphic designer specializing in vector illustrations and character designs.", skills: ["Character Design", "Vector Illustration"] },
    { name: "Clara Dupont",   bio: "Watercolor specialist capturing the elegance of botanical life and urban sketch scenes.", skills: ["Watercolor Painting", "Botanical Illustration"] },
    { name: "Zane Miller",    bio: "Speed-drawing expert and live-caricaturist bringing events to life with quick, expressive strokes.", skills: ["Speed Drawing", "Caricatures"] },
    { name: "Naomi Campbell", bio: "Body painting artist pushing the boundaries of temporary human canvas installations.", skills: ["Full Body Painting", "Special FX Makeup"] },
    { name: "Liam O'Connor",  bio: "Calligraphy expert specializing in medieval scripts and hand-lettered luxury branding.", skills: ["Gothic Calligraphy", "Monograms"] }
  ].freeze

  CUSTOMER_DATA = [
    { name: "Emily Davis",      email: "emily.davis@example.com" },
    { name: "James Wilson",     email: "james.wilson@example.com" },
    { name: "Sophia Martinez",  email: "sophia.martinez@example.com" },
    { name: "Benjamin Thomas",  email: "benjamin.thomas@example.com" },
    { name: "Isabella Garcia",  email: "isabella.garcia@example.com" },
    { name: "Lucas Robinson",   email: "lucas.robinson@example.com" },
    { name: "Mia Rodriguez",    email: "mia.rodriguez@example.com" },
    { name: "Alexander Clark",  email: "alexander.clark@example.com" },
    { name: "Charlotte Lewis",  email: "charlotte.lewis@example.com" },
    { name: "Daniel Lee",       email: "daniel.lee@example.com" }
  ].freeze

  REVIEW_COMMENTS = [
    "Absolutely stunning work! Exceeded all expectations.",
    "Very professional, great communication throughout the process.",
    "Highly recommended! The attention to detail is remarkable.",
    "Creative, punctual, and highly skilled. Will book again.",
    "Beautiful result. Took our initial concept and made it spectacular."
  ].freeze

  def self.run
    raise "Safety guard: seeding is not allowed in production." if Rails.env.production?

    new.run
  end

  def run
    ActiveRecord::Base.transaction do
      clean_database
      create_admin
      create_artists
      create_customers
      create_bookings_and_reviews
      print_summary
    end
  rescue => e
    log_error("Seeding failed and was rolled back: #{e.message}")
    log_error(e.backtrace.first(5).join("\n"))
    raise ActiveRecord::Rollback
  end

  private

  def clean_database
    log_info("Cleaning database...")

    # Ordered to respect foreign-key dependency graph
    [Review, Payment, Booking, Availability, Service, ArtistProfile, User].each do |klass|
      log_info("  Deleting #{klass.name} records...")
      klass.destroy_all
    end
  end

  def create_admin
    log_info("Creating Admin...")
    User.create!(
      name:     "System Admin",
      email:    "admin@jothis.com",
      password: "password123",
      role:     "admin",
      status:   "active"
    )
  end

  def create_artists
    log_info("Creating Artists and Profiles...")

    ARTIST_DATA.each do |data|
      email = "#{data[:name].downcase.gsub(/[^a-z0-9]/, ".")}@example.com"

      # Supply the profile via nested attributes so the User model's after_create
      # callback does not fire and create a duplicate empty profile.
      artist_user = User.create!(
        name:     data[:name],
        email:    email,
        password: "password123",
        role:     "artist",
        status:   "active",
        artist_profile_attributes: {
          name:             data[:name],
          bio:              data[:bio],
          base_price:       rand(75..250),
          city:             CITIES.sample,
          experience_years: rand(3..15),
          is_approved:      true,
          approved_at:      Time.current
        }
      )

      profile = artist_user.artist_profile

      data[:skills].each do |skill|
        Service.create!(
          artist_profile:   profile,
          name:             skill,
          description:      "Professional #{skill.downcase} service tailored to your requirements.",
          price:            profile.base_price + rand(20..80),
          duration_minutes: [60, 90, 120].sample
        )
      end

      # Weekday availabilities only
      (0..6).each do |offset|
        date = Date.current + offset.days
        next if date.saturday? || date.sunday?

        Availability.create!(
          artist_profile: profile,
          available_date:  date,
          start_time:      "09:00",
          end_time:        "17:00",
          is_booked:       false
        )
      end
    end
  end

  def create_customers
    log_info("Creating Customers...")

    CUSTOMER_DATA.each do |data|
      User.create!(
        name:     data[:name],
        email:    data[:email],
        password: "password123",
        role:     "customer",
        status:   "active"
      )
    end
  end

  def create_bookings_and_reviews
    log_info("Creating Bookings, Payments, and Reviews...")

    customers       = User.where(role: "customer").to_a
    artist_profiles = ArtistProfile.includes(:services).to_a
    booked_slots    = Set.new # prevents unique constraint violations in the seed loop

    20.times do |i|
      customer       = customers.sample
      artist_profile = artist_profiles.sample
      service        = artist_profile.services.sample
      next unless service

      # Attempt to find a free time slot (up to 5 tries)
      booking_date = nil
      start_hour   = nil

      5.times do
        candidate_date = Date.current + rand(1..14).days
        candidate_hour = rand(9..16)
        slot_key       = "#{artist_profile.id}-#{candidate_date}-#{candidate_hour}"

        unless booked_slots.include?(slot_key)
          booking_date = candidate_date
          start_hour   = candidate_hour
          booked_slots.add(slot_key)
          break
        end
      end

      next unless booking_date && start_hour

      status = i % 5 == 0 ? "pending" : "confirmed"

      booking = Booking.create!(
        customer_id:       customer.id,
        artist_profile:    artist_profile,
        service:           service,
        booking_date:      booking_date,
        start_time:        format("%02d:00", start_hour),
        end_time:          format("%02d:00", start_hour + 1),
        status:            status,
        total_amount:      service.price
      )

      next unless booking.status == "confirmed"

      Payment.create!(
        booking:                    booking,
        amount:                     booking.total_amount,
        currency:                   "USD",
        payment_status:             "succeeded",
        stripe_payment_intent_id:   "pi_mock_#{SecureRandom.hex(10)}"
      )

      next unless rand > 0.4

      Review.create!(
        customer_id:       customer.id,
        artist_profile:    artist_profile,
        booking:           booking,
        rating:            rand(4..5),
        comment:           REVIEW_COMMENTS.sample
      )
    end
  end

  def print_summary
    log_info("\n" + "=" * 42)
    log_info("  SEED COMPLETED SUCCESSFULLY!")
    log_info("=" * 42)
    log_info("  Admins:    #{User.where(role: 'admin').count}")
    log_info("  Customers: #{User.where(role: 'customer').count}")
    log_info("  Artists:   #{ArtistProfile.count}")
    log_info("  Services:  #{Service.count}")
    log_info("  Bookings:  #{Booking.count}")
    log_info("  Reviews:   #{Review.count}")
    log_info("=" * 42)
  end

  def log_info(message)
    puts message
    Rails.logger.info(message)
  end

  def log_error(message)
    warn "\e[31m#{message}\e[0m"
    Rails.logger.error(message)
  end
end

DatabaseSeeder.run
