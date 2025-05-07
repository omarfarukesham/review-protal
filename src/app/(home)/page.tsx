import Banner from "@/components/Home/Banner";
import ReviewSection from "@/components/Home/ReviewSection";
import StatsSection from "@/components/Home/Stats";
const Home = () => {
  return (
    <div>
      {/* Banner section */}
      <Banner/>
      {/* Review Section */}
      <ReviewSection />
    <StatsSection />
    </div>
  );
};

export default Home;