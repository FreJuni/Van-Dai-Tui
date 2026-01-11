

import { Hero, Categories } from "@/components/landing-page/home-components";
import { TrustSection } from "@/components/landing-page/trust-section";
import { NewArrivals } from "@/components/landing-page/new-arrivals";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Best Phone Shop in Malaysia",
  description: "Your trusted source for quality tech gadgets and repairs in Malaysia. We offer a wide range of phones, tablets, and laptops.",
};

export default async function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <TrustSection />
      <Categories />
      <NewArrivals />
    </div>
  );
}
