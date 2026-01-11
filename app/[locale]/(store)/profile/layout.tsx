import ProfileNavigation from "@/components/profile-nav/profile-nav"
import { auth } from "@/server/auth";
import { Metadata } from 'next';

export const metadata: Metadata = {
    robots: {
        index: false,
    },
    title: 'Profile',
}

export default async function ProfileLayout({
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