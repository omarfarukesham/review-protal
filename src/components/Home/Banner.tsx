import React from "react";
import { Button } from "../ui/button";

const Banner = () => {
  return (
    <section className="">
      <div className="lg:h-[700px] w-full bg-[linear-gradient(rgba(0,0,0,0.7),rgba(0,0,0,0.7)),url('/bgimg.jpg')] bg-cover bg-center flex justify-left items-center">
        <div className="lg:ml-16 ml-5 text-white max-w-[560px]">
          <h1 className="lg:text-6xl text-4xl font-bold">
            Discover the Best Products with Expert Reviews
          </h1>
          <p className="lg:text-lg  text-base mt-6 mb-8">
            Find the perfect product for your needs with our in-depth reviews.
            Join our community of savvy shoppers today!
          </p>
          <div>
            <Button className="h-10 bg-white text-black hover:bg-white active:scale-95 transition-transform duration-300">
              Explore
            </Button>

            <Button className="ml-3 h-10 bg-transparent border border-white text-white hover:bg-transparent active:scale-95 transition-transform duration-300">
              Join
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
