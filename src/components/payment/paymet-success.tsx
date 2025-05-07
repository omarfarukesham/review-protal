"use client";

import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getPaymentById } from "@/Services/Payments";
import React from "react";
import { TPaymentPayload } from "@/types/globals";
import Link from "next/link";

export default function PaymentSuccessPage({ p_Id }: { p_Id: string }) {

  const [paymentDetails, setPaymentDetails] =
    React.useState<TPaymentPayload | null>(null);

  React.useEffect(() => {
    const getPaymentInfo = async () => {
      const result = await getPaymentById(p_Id);

      setPaymentDetails(result.data);
    };
    getPaymentInfo();
  }, [p_Id]);


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-600">
            Payment Successful!
          </CardTitle>
          <CardDescription>
            Your transaction has been completed successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="mb-3 text-xs font-medium text-gray-500">
              Transaction Id
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Order ID</span>
                <span className="text-xs font-medium">
                  {paymentDetails?.transactionId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Date</span>
                <span className="text-xs font-medium">
                  {paymentDetails?.completedAt}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-600">Email</span>
                <span className="text-xs font-medium">{paymentDetails?.email}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between">
                <span className="text-xs font-medium text-gray-600">
                  Total Amount
                </span>
                <span className="text-xs font-bold text-green-600">
                  {paymentDetails?.amount}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-800">
            A confirmation email has been sent to your email address.
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link href="/">
            <Button variant={'outline'} className="w-full hover:cursor-pointer">
              <Home className="mr-2 h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
