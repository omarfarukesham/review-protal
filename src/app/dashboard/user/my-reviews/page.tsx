"use client";
import ReviewManagementTable from "@/components/ReviewManagement/MyReviews";
import React from "react";

const page = () => {
  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-center mb-5">My Reviews</h1>
      <ReviewManagementTable />
    </div>
  );
};

export default page;
