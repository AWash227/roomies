import {
	BuildingIcon,
	HouseIcon,
	LogInIcon,
	LogOutIcon,
	UserRoundPlusIcon,
} from "lucide-react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "./ui/sidebar";
import { SidebarSignOutButton } from "./sidebar-sign-out-button";
import { SidebarSignInButton } from "./sidebar-sign-in-button";
import { auth } from "@/app/api/auth/[...nextauth]/auth";
import { SidebarSignUpButton } from "./sidebar-sign-up-button";

const items = [
	{
		title: "Home",
		icon: HouseIcon,
		url: "/",
	},
	{
		title: "Buildings",
		icon: BuildingIcon,
		url: "/buildings",
	},
];

export const AppSidebar = () => {
	const session = auth();
	return (
		<Sidebar>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Application</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarSignUpButton />
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarSignInButton />
					</SidebarMenuItem>
					<SidebarMenuItem>
						<SidebarSignOutButton />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
};
