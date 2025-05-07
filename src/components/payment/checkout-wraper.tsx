// src/components/payment/checkout-wrapper.tsx
"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutPage from "./checkout-page";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutWrapper({ reviewId }: { reviewId: string }) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutPage reviewId={reviewId} />
    </Elements>
  );
}
