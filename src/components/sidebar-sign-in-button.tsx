"use client";

import { signIn, useSession } from "next-auth/react";
import { LogInIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export const SidebarSignInButton = () => {
	const { data: session } = useSession();
	if (session) return null;
	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				onClick={async () => await signIn(undefined, { redirectTo: "/" })}
			>
				<LogInIcon className="w-4 h-4 mr-2" />
				<span>Sign In</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
};
