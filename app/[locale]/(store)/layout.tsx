import TopNavBar from "@/components/topnavbar/top-nav-bar";
import Footer from "@/components/footer/footer";
import { AIConcierge } from "@/components/search/ai-concierge";
import { WhatsAppFAB } from "@/components/contact/whatsapp-fab";
import { auth } from "@/server/auth";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const adminPhone = process.env.ADMIN_PHONE_NUMBER || "";

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavBar session={session!} />
      <main className="grow">
        {children}
      </main>
      <Footer />
      <WhatsAppFAB phoneNumber={adminPhone} />
      <AIConcierge />
    </div>
  );
}
