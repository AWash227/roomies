import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/side-bar";
import { cookies } from "next/headers";
import { SessionProvider } from "next-auth/react";
import { auth } from "./api/auth/[...nextauth]/auth";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Roomies",
	description: "Dorm Management Software",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();
	console.log(session);
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<SessionProvider session={session}>
					<SidebarProvider defaultOpen={defaultOpen}>
						<AppSidebar />
						<main>
							<SidebarTrigger />
							{children}
						</main>
					</SidebarProvider>
					{children}
				</SessionProvider>
			</body>
		</html>
	);
}
