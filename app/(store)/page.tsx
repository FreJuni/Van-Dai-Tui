
import TopNavBar from "@/components/topnavbar/top-nav-bar";
import { auth } from "@/server/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";

import { Hero, Categories } from "@/components/landing-page/home-components";

export default async function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <Categories />
    </div>
  );
}
