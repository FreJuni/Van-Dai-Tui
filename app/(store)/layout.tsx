import TopNavBar from "@/components/topnavbar/top-nav-bar";
import Footer from "@/components/footer/footer";
import { AIConcierge } from "@/components/search/ai-concierge";
import { auth } from "@/server/auth";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavBar session={session!} />
      <main className="grow">
        {children}
      </main>
      <Footer />
      <AIConcierge />
    </div>
  );
}
