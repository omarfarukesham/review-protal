import { SectionCards } from "@/components/section-cards";
import React from "react";

const UserDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6">
          {/* Header Section */}
          <div className="rounded-lg bg-card p-6 shadow-sm">
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              User Dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your profile and view your activity
            </p>
          </div>

          {/* Main Content */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SectionCards />
          </div>

          {/* Additional Content Area */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Charts Section - Uncomment when ready */}
            {/* <div className="rounded-lg bg-card p-6 shadow-sm">
              <ChartAreaInteractive />
            </div> */}

            {/* Table Section - Uncomment when ready */}
            {/* <div className="rounded-lg bg-card p-6 shadow-sm">
              <DataTable data={data} />
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;



// import { SectionCards } from "@/components/section-cards";
// import React from "react";
// const UserDashboard = () => {
//   return (
//     <div>
//       <div className="flex flex-1 flex-col">
//         <div className="@container/main flex flex-1 flex-col gap-2">
//           <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//             <SectionCards />
//             {/* <div className="px-4 lg:px-6">
//               <ChartAreaInteractive />
//             </div> */}
//             {/* <DataTable data={data} /> */}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
