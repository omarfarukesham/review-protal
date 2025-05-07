"use client";
import React, { useCallback, useState } from "react";
import useFetch from "@/hooks/useDataFetch";

import CustomLoader from "@/components/common/custom-loader";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Check,
  X,
  Download,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Pagination } from "@/components/common/pagination";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession } from "next-auth/react";
import { getUsersAllPayments } from "@/Services/Payments";

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "MMM dd, yyyy • hh:mm a");
};

// Helper function for payment status badge
const PaymentStatusBadge = ({ status }: { status: "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED" }) => {
  const statusStyles: Record<"CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED", string> = {
    CONFIRMED: "bg-black text-white",
    PENDING: "bg-gray-200 text-gray-800",
    FAILED: "bg-red-100 text-red-800",
    REFUNDED: "bg-blue-100 text-blue-800",
  };

  return (
    <Badge className={`${statusStyles[status as keyof typeof statusStyles] || "bg-gray-100"} font-medium`}>
      {status === "CONFIRMED" && <Check className="w-3 h-3 mr-1" />}
      {status === "FAILED" && <X className="w-3 h-3 mr-1" />}
      {status}
    </Badge>
  );
};

// Receipt component for mobile view
interface Payment {
  id: string;
  paymentStatus: "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED";
  amount: number;
  currency?: string;
  completedAt?: string;
  createdAt?: string;
  paymentMethod?: string;
  transactionId?: string;
  email?: string;
  paymentType?: string;
  reviewId: string;
}

const PaymentReceipt = ({ payment }: { payment: Payment }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-sm text-gray-500">Receipt ID</span>
          <h3 className="font-medium text-black">
            {payment.id.substring(0, 8)}...
          </h3>
        </div>
        <PaymentStatusBadge status={payment.paymentStatus} />
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <span className="text-xs text-gray-500">Amount</span>
          <p className="font-bold text-black">
            {payment.amount} {payment.currency?.toUpperCase() || "BDT"}
          </p>
        </div>

        <div>
          <span className="text-xs text-gray-500">Date</span>
          <p className="text-sm">
            {formatDate(payment.completedAt || payment.createdAt || "")}
          </p>
        </div>

        <div>
          <span className="text-xs text-gray-500">Payment Method</span>
          <p className="text-sm">{payment.paymentMethod || "N/A"}</p>
        </div>
      </div>

      <Accordion
        type="single"
        collapsible
        className="border-t border-gray-100 pt-2"
      >
        <AccordionItem value="details" className="border-b-0">
          <AccordionTrigger className="py-2 text-sm hover:no-underline">
            View Details
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono">
                  {payment.transactionId || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span>{payment.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Payment Type</span>
                <span>{payment.paymentType}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-4 flex justify-between">
        <Button
          variant="outline"
          size="sm"
          className="text-black border-gray-200 hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-1" />
          Download
        </Button>
        <Link href={`/reviews/${payment.reviewId}`}>
          <Button size="sm" className="bg-black text-white hover:bg-gray-800">
            View Review
          </Button>
        </Link>
      </div>
    </div>
  );
};

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // const [currentPage, ] = useState(1);
  const { data: session } = useSession();
  // Fetch payment history data
 // Fetch payment history data
 const fetchPaymentHistory = useCallback(() => {
  if (!session?.user?.email) {
    return Promise.resolve([]); // Handle undefined email safely
  }
  return getUsersAllPayments(session.user.email);
}, [session?.user?.email]);

  const { data, loading, error } = useFetch(fetchPaymentHistory);
  // console.log("data", data);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="relative mb-12 text-center">
            <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200 -z-10"></div>
            <h1 className="inline-block px-8 text-4xl font-serif font-bold text-black bg-white relative">
              Payment History
            </h1>
          </div>

          {/* Search and filters */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="relative max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search by transaction ID or review title..."
                  className="pl-10 pr-4 py-2 w-full border-gray-200 focus:border-black focus:ring-1 focus:ring-black rounded-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          {/* Main Content */}
          {loading ? (
            <div className="flex justify-center my-12">
              <CustomLoader />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 my-12">
              Error loading payment history. Please try again.
            </div>
          ) : (
            <>
              {/* Desktop View - Table */}
              <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm mb-8">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-1/5">Date</TableHead>
                      <TableHead className="w-1/6">Transaction ID</TableHead>
                      <TableHead className="w-1/6">Amount</TableHead>
                      <TableHead className="w-1/6">Method</TableHead>
                      <TableHead className="w-1/6">Status</TableHead>
                      <TableHead className="w-1/6 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.data?.length > 0 ? (
                      data.data.map((payment: Payment) => (
                        <TableRow key={payment.id} className="hover:bg-gray-50">
                          <TableCell className="font-medium">
                            {formatDate(
                              payment.completedAt || payment.createdAt || ""
                            )}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {payment.transactionId
                              ? payment.transactionId.substring(0, 8) + "..."
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            <span className="font-bold">
                              {payment.amount}{" "}
                              {payment.currency?.toUpperCase() || "BDT"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {payment.paymentMethod || "N/A"}
                          </TableCell>
                          <TableCell>
                            <PaymentStatusBadge
                              status={payment.paymentStatus}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-black border-gray-200 hover:bg-gray-50"
                              >
                                <Download className="h-4 w-4" />
                                <span className="sr-only md:not-sr-only md:ml-2">
                                  Receipt
                                </span>
                              </Button>
                              <Link href={`/reviews/${payment.reviewId}`}>
                                <Button
                                  size="sm"
                                  className="bg-black text-white hover:bg-gray-800"
                                >
                                  View Review
                                </Button>
                              </Link>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          No payment history found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View - Cards */}
              <div className="md:hidden">
                {data?.data?.length > 0 ? (
                  data.data.map((payment: Payment) => (
                    <PaymentReceipt key={payment.id} payment={payment} />
                  ))
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-gray-500">No payment history found</p>
                  </Card>
                )}
              </div>

              {/* Pagination */}
              {data?.meta?.totalPage > 1 && (
                <div className="mt-12 relative">
                  <div className="absolute left-0 right-0 top-1/2 border-t border-gray-200 -z-10"></div>
                  <div className="flex justify-center">
                    <div className="inline-block px-6 bg-white">
                      <Pagination
                        totalPages={data.meta.totalPage}
                        currentPage={data.meta.page}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Total Spent</h3>
              <p className="text-3xl font-bold">
                {data?.meta?.totalSpent || 0} BDT
              </p>
              <p className="text-sm text-gray-500 mt-1">
                From {data?.meta?.totalTransactions || 0} transactions
              </p>
            </Card>
            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Premium Reviews</h3>
              <p className="text-3xl font-bold">
                {data?.meta?.totalReviews || 0}
              </p>
              <p className="text-sm text-gray-500 mt-1">Purchased reviews</p>
            </Card>
            <Card className="p-6 border border-gray-200">
              <h3 className="text-lg font-medium mb-2">Latest Purchase</h3>
              <p className="text-lg font-bold">
                {data?.meta?.latestPurchaseDate
                  ? format(
                      new Date(data.meta.latestPurchaseDate),
                      "MMM dd, yyyy"
                    )
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {data?.meta?.latestReviewTitle || "No recent purchases"}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
