"use client";

import { signOut, useSession } from "next-auth/react";
import { LogOutIcon } from "lucide-react";
import { SidebarMenuButton } from "./ui/sidebar";

export const SidebarSignOutButton = () => {
	const { data: session } = useSession();
	if (!session) return null;
	return (
		<SidebarMenuButton onClick={async () => await signOut()}>
			<LogOutIcon className="w-4 h-4 mr-2" />
			<span>Sign Out</span>
		</SidebarMenuButton>
	);
};
