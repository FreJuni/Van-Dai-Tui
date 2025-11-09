import ProfileNavigation from "@/components/profile-nav/profile-nav"
import { auth } from "@/server/auth";

export default async function ProfileLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth();

    return (
        <html lang="en">
            <body>
                <nav>
                    <ProfileNavigation session={session!} />
                </nav>
                <main>{children}</main>
            </body>
        </html>
    )
}