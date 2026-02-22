module Api
  module V1
    class PaymentsController < ApplicationController
      include Crudable
      load_and_authorize_resource

      private

      def payment_params
        params.require(:payment).permit(:booking_id, :amount, :currency, :payment_status, :stripe_payment_intent_id)
      end

      def resource_params
        payment_params
      end

      def collection
        Payment.all.order(created_at: :desc)
      end
    end
  end
end
