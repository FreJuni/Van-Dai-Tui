
import TopNavBar from "@/components/topnavbar/top-nav-bar";
import { auth } from "@/server/auth";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default async function Home() {
  const session = await auth();

  return (
    <div className="">

    </div>
  );
}
