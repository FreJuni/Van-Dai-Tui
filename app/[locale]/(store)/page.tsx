

import { Hero, Categories } from "@/components/landing-page/home-components";
import { TrustSection } from "@/components/landing-page/trust-section";
import { NewArrivals } from "@/components/landing-page/new-arrivals";

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
