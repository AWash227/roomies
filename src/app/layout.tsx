import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/side-bar";
import { cookies } from "next/headers";
import { SessionProvider } from "next-auth/react";
import { auth } from "./api/auth/[...nextauth]/auth";
import { Toaster } from "sonner";

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

	return (
		<html lang="en" className="w-full h-full">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased w-full h-full`}
			>
				<SessionProvider session={session}>
					{children}
					<Toaster richColors />
				</SessionProvider>
			</body>
		</html>
	);
}
