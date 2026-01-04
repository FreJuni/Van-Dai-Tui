import { auth } from "@/server/auth";
import { redirect } from "next/navigation";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/dashboard/app-sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Protection: Redirect if not admin
    if (!session?.user || session.user.role !== 'admin') {
        return redirect('/');
    }

    return (
        <SidebarProvider >
            <AppSidebar />
            <SidebarInset className="bg-gray-50/50 min-h-screen">
                <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-white sticky top-0 z-10 w-full mb-4 md:hidden">
                    <SidebarTrigger />
                    <span className="font-bold text-sm">Dashboard</span>
                </div>
                <div className="p-4 md:p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
