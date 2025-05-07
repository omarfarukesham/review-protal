"use client";
import { confirmPayment, getSession } from "@/Services/Payments";
import { getReviewDetails } from "@/Services/Reviews";
import {
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { TPaymentPayload, TReview } from "@/types/globals";
import React, { useEffect } from "react";
import { FaCcAmex } from "react-icons/fa6";
import { SiMastercard, SiVisa } from "react-icons/si";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CheckoutPage = ({ reviewId }: { reviewId: string }) => {
  const session = useSession();
  const router = useRouter()
  const user = session?.data?.user;
  const [review, setReview] = React.useState<TReview | null>(null);
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [clientSecret, setClientSecret] = React.useState(null);
  const [cardComplete, setCardComplete] = React.useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  //   stripe element for custom fields
  const stripe = useStripe();
  const elements = useElements();

  // Create references for Stripe Elements mounting
  const cardNumberRef = React.useRef(null);
  const cardExpiryRef = React.useRef(null);
  const cardCvcRef = React.useRef(null);

  // Create and mount Stripe Elements when component loads
  useEffect(() => {
    if (!stripe || !elements) return;

    // Define styles for Stripe Elements
    const elementStyle = {
      base: {
        fontSize: "16px",
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        "::placeholder": {
          color: "#aab7c4",
        },
        padding: "10px 12px",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    };

    // Create card elements
    const cardNumberElement = elements.create("cardNumber", {
      style: elementStyle,
    });
    const cardExpiryElement = elements.create("cardExpiry", {
      style: elementStyle,
    });
    const cardCvcElement = elements.create("cardCvc", { style: elementStyle });

    // Mount elements when refs are available
    if (cardNumberRef.current) cardNumberElement.mount(cardNumberRef.current);
    if (cardExpiryRef.current) cardExpiryElement.mount(cardExpiryRef.current);
    if (cardCvcRef.current) cardCvcElement.mount(cardCvcRef.current);

    // Add event listeners for completion status
    cardNumberElement.on("change", (event) => {
      setCardComplete((prev) => ({ ...prev, cardNumber: event.complete }));
    });

    cardExpiryElement.on("change", (event) => {
      setCardComplete((prev) => ({ ...prev, cardExpiry: event.complete }));
    });

    cardCvcElement.on("change", (event) => {
      setCardComplete((prev) => ({ ...prev, cardCvc: event.complete }));
    });

    // Cleanup function to unmount elements when component unmounts
    return () => {
      cardNumberElement.destroy();
      cardExpiryElement.destroy();
      cardCvcElement.destroy();
    };
  }, [stripe, elements]);

  //fetching review info
  useEffect(() => {
    const fetchReviewDetails = async () => {
      const result = await getReviewDetails(reviewId);
      setReview(result.data);
    };
    fetchReviewDetails();
  }, [reviewId]);

  useEffect(() => {
    const fetchStripeSession = async () => {
      const result = await getSession({
        name: user?.name as string,
        email: user?.email as string,
        amount: Number(review?.price || 200),
      });
      setClientSecret(result?.data?.clientSecret);
    };
    if (user) fetchStripeSession();
  }, [ user, review?.price]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Payment processing... stay tune 😊");
    if (!stripe || !elements || !clientSecret) {
      toast.error("Payment system aren't available. Try again");
      return;
    }

    // Make sure all required fields are complete
    if (!name.trim()) {
      toast.error("Please enter cardholder name");
      return;
    }

    if (!Object.values(cardComplete).every(Boolean)) {
      toast.error("Please fill in all card details");
      return;
    }

    setLoading(true);
    setName("");
    cardNumberRef.current = null;
    cardExpiryRef.current = null;
    cardCvcRef.current = null;

    try {
      // Get card element
      const cardElement = elements.getElement("cardNumber");

      if (!cardElement) {
        throw new Error("Card element not found");
      }

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: name,
            },
          },
        }
      );

      if (error) {
        toast.error(error.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        const paymentDetails = {
          email: user?.email,
          reviewId: review?.id,
          name: name,
          currency: paymentIntent.currency,
          transactionId: paymentIntent.id,
          paymentStatus: "CONFIRMED" as TPaymentPayload["paymentStatus"],
          paymentMethod:
            paymentIntent.payment_method_types[0].charAt(0).toUpperCase() +
            paymentIntent.payment_method_types[0].slice(1),
        };
        // alert(JSON.stringify(paymentDetails));

        setName("");
        elements.getElement("cardNumber")?.clear();
        elements.getElement("cardExpiry")?.clear();
        elements.getElement("cardCvc")?.clear();

        const res = await confirmPayment(paymentDetails as TPaymentPayload);

        if (res?.success === true) {
          toast.success(res?.message, { id: toastId });
          router.push(`/success/${res?.data?.id}`)
        }
        else if (res?.success === false) {
          toast.error("Already baught or something error", { id: toastId });
        }
      } else {
        toast.warning(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("An error occurred during payment processing", {
        id: toastId,
      });
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md  mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Payment Details
          </h2>
          <div className="flex space-x-2 ml-2">
            <SiVisa className="w-6 h-6" />
            <SiMastercard className="w-6 h-6" />
            <FaCcAmex className="w-6 h-6" />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Holder Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-teal-900"
              placeholder="John Smith"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Card Number
            </label>
            <div
              ref={cardNumberRef}
              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-teal-900"
            />
          </div>

          <div className="flex space-x-4 mb-6">
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <div
                ref={cardExpiryRef}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-teal-900"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CVC
              </label>
              <div
                ref={cardCvcRef}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-teal-900"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-teal-900 bg-foreground hover:cursor-pointer"
            disabled={!stripe || !clientSecret}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              "Pay Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
