"use client";
import { useState, useEffect } from "react";

// Define types based on your Prisma schema


type Review = {
  id: string;
  title: string;
  category: "MOVIE" | "TV_SHOW" | "BOOK" | "ELECTRONICS" | "VEHICLE";
  isPremium: boolean;
  price: number | null;
  _count?: {
    Payment: number;
  };
};

type AnalyticsData = {
  totalEarnings: number;
  confirmedEarnings: number;
  pendingEarnings: number;
  popularPremiumReviews: (Review & {
    revenue: number;
    purchaseCount: number;
  })[];
};



const EarningsCard = ({
  title,
  value,
  icon,
  bgColor,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
}) => (
  <div className={`rounded-lg p-6 shadow-md ${bgColor} text-white`}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-medium opacity-80">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
      <div className="text-3xl opacity-80">{icon}</div>
    </div>
  </div>
);

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">(
    "month"
  );

  // For now using only mock data since the API isn't built yet
  // Load mock data for demo purposes
  useEffect(() => {
    // Mock data for analytics dashboard
    const mockData: AnalyticsData = {
      totalEarnings: 12580.75,
      confirmedEarnings: 10250.5,
      pendingEarnings: 2330.25,
      popularPremiumReviews: [
        {
          id: "1",
          title: "iPhone 15 Pro Review",
          category: "ELECTRONICS",
          isPremium: true,
          price: 7.99,
          revenue: 2877.4,
          purchaseCount: 360,
        },
        {
          id: "2",
          title: "Tesla Model Y Review",
          category: "VEHICLE",
          isPremium: true,
          price: 9.99,
          revenue: 2297.7,
          purchaseCount: 230,
        },
        {
          id: "3",
          title: "Game of Thrones Final Season",
          category: "TV_SHOW",
          isPremium: true,
          price: 5.99,
          revenue: 1797.0,
          purchaseCount: 300,
        },
        {
          id: "4",
          title: "MacBook Pro M3 Review",
          category: "ELECTRONICS",
          isPremium: true,
          price: 8.99,
          revenue: 1618.2,
          purchaseCount: 180,
        },
        {
          id: "5",
          title: "Dune Part Two Analysis",
          category: "MOVIE",
          isPremium: true,
          price: 6.99,
          revenue: 1258.2,
          purchaseCount: 180,
        },
      ],
    };

    setAnalyticsData(mockData);
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-lg font-medium text-gray-600">
          Loading analytics data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 my-4">
        <p className="font-medium">Error loading analytics data</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 my-4">
        <p className="font-medium">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 md:p-6 rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Premium Reviews Analytics
        </h1>
        <div className="flex gap-2">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={timeRange}
            onChange={(e) =>
              setTimeRange(e.target.value as "week" | "month" | "year")
            }
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
        </div>
      </div>

      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <EarningsCard
          title="Total Earnings"
          value={`$${analyticsData.totalEarnings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<span>💰</span>}
          bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <EarningsCard
          title="Confirmed Earnings"
          value={`$${analyticsData.confirmedEarnings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<span>✅</span>}
          bgColor="bg-gradient-to-r from-green-500 to-green-600"
        />
        <EarningsCard
          title="Pending Earnings"
          value={`$${analyticsData.pendingEarnings.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
          icon={<span>⏳</span>}
          bgColor="bg-gradient-to-r from-amber-500 to-amber-600"
        />
      </div>

      {/* Popular Premium Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Popular Premium Reviews
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Review Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Purchases
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.popularPremiumReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {review.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        review.category === "ELECTRONICS"
                          ? "bg-blue-100 text-blue-800"
                          : review.category === "VEHICLE"
                          ? "bg-green-100 text-green-800"
                          : review.category === "TV_SHOW"
                          ? "bg-purple-100 text-purple-800"
                          : review.category === "MOVIE"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {review.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${review.price?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {review.purchaseCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    $
                    {review.revenue.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}