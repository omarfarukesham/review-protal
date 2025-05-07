"use client";
import { getReviewCount } from "@/Services/Reviews";
import { ArrowRight, FileText, Users } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function StatsSection() {
  const [animateStats, setAnimateStats] = useState(false);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    setAnimateStats(true);
    const reviewCount = async () => {
      const res = await getReviewCount();
      setReviewCount(res.data);
    };
    reviewCount();
  }, []);

  return (
    <div className="w-full bg-white p-8 md:p-12 border-l-2 border-black shadow-md relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-gray-100 rounded-full opacity-30 blur-xl"></div>
      <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-gray-100 rounded-full opacity-20 blur-lg"></div>
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:justify-between gap-12">
          {/* Left column - Heading only */}
          <div className="md:max-w-md">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 font-medium text-sm mb-4">
              <span className="mr-2">◆</span>
              Stats
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-black">
              Discover Our Impressive User and Review Statistics
            </h2>
            <div className="h-1 w-20 bg-black mt-6"></div>
          </div>

          {/* Right column - Everything else */}
          <div className="md:max-w-xl">
            <p className="text-lg text-gray-700 mb-10 leading-relaxed">
              Join our thriving community of reviewers! With thousands of
              reviews and active users, we provide insights that matter.
            </p>

            <div className="flex flex-col sm:flex-row justify-between gap-8">
              {/* First stat */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-sm">
                    <FileText className="h-5 w-5 text-black" />
                  </span>
                </div>
                <p
                  className={`text-5xl sm:text-6xl font-bold mb-2 transition-all duration-1000 ${
                    animateStats ? "opacity-100" : "opacity-0 -translate-y-4"
                  }`}
                >
                  <span className="text-black">{reviewCount}</span>
                </p>
                <p className="text-gray-600">
                  Total Reviews Submitted by Our Community
                </p>
              </div>

              {/* Second stat */}
              <div className="bg-white p-6 rounded-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  <span className="inline-flex items-center justify-center p-2 bg-gray-100 rounded-sm"></span>
                  <Users className="h-5 w-5 text-black" />
                </div>
                <p
                  className={`text-5xl sm:text-6xl font-bold mb-2 transition-all duration-1000 delay-300 ${
                    animateStats ? "opacity-100" : "opacity-0 -translate-y-4"
                  }`}
                >
                  <span className="text-black">1000</span>
                </p>
                <p className="text-gray-600">
                  Active Users Engaging with Our Platform Daily
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex items-center space-x-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-900 transition-colors"
              >
                Register
              </Link>
              <Link
                href="/reviews"
                className="group flex items-center font-medium text-black hover:text-gray-700 transition-colors"
              >
                Explore Reviews
                <ArrowRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
