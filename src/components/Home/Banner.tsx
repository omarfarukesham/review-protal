import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
// import { useNavigation } from "react-day-picker";

const Banner = () => {

  return (
    <section className="relative w-full">
    <div className="relative lg:h-[700px] h-[500px] w-full overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-[url('/bgimg.jpg')] bg-cover bg-center" />
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content container */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-5 sm:px-6 lg:px-8">
          <div className="max-w-[560px] text-white">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
              Discover the Best Products with Expert Reviews
            </h1>
            
            <p className="mt-6 mb-8 text-base lg:text-lg leading-relaxed opacity-90">
              Find the perfect product for your needs with our in-depth reviews.
              Join our community of savvy shoppers today!
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link 
                href="/reviews" 
                className="px-8 py-3 bg-white text-black font-medium rounded-md hover:bg-gray-100 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/30"
              >
                Explore Reviews
              </Link>
              
              <Link 
                href="/register" 
                className="px-8 py-3 bg-transparent border-2 border-white text-white font-medium rounded-md hover:bg-white/10 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/30"
              >
                Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
};

export default Banner;
