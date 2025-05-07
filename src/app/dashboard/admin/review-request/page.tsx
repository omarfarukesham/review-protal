import ApprovalTableRow from "@/components/Admin/ApprovalTable";
import React from "react";

const page = () => {
  return (
    <div>
      <h1 className="mt-5 text-3xl font-bold text-center mb-5">Review Requests</h1>
      <ApprovalTableRow />
    </div>
  );
};

export default page;
