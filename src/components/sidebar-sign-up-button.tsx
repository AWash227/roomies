"use client";
import { UserRoundPlusIcon } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";
import { useSession } from "next-auth/react";

export const SidebarSignUpButton = () => {
	const { data: session } = useSession();
	if (session) return null;
	return (
		<SidebarMenuButton asChild>
			<a href="/signup">
				<UserRoundPlusIcon />
				<span>Sign Up</span>
			</a>
		</SidebarMenuButton>
	);
};
