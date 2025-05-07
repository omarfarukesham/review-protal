"use client";

import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";


export default function Home({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
      {/* Footer */}
      <Footer />
    </div>
  );
}
