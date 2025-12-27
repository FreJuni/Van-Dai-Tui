import ProfileNavigation from "@/components/profile-nav/profile-nav"
import { auth } from "@/server/auth";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    return (
        <div className="flex flex-col min-h-full">
            <ProfileNavigation session={session!} />
            <div className="flex-1">{children}</div>
        </div>
    )
}