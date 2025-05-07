// Fixed payment page component
import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const CheckoutWrapper = dynamic(
  () => import("@/components/payment/checkout-wraper"),
  { ssr: true }
);

// Define params type as specified by Next.js 15.3.2
type Params = {
  reviewId: string;
};

// Use the required Next.js App Router page props pattern
export default function PaymentPage({
  params,
}: {
  params: Params;
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { reviewId } = params;
  
  return (
    <div className="w-full min-h-screen flex justify-center items-center">
      <CheckoutWrapper reviewId={reviewId} />
    </div>
  );
}

// Optional: Add metadata generation if needed
export async function generateMetadata({ 
  params 
}: { 
  params: Params 
}): Promise<Metadata> {
  return {
    title: `Payment for Review ${params.reviewId}`,
  };
}