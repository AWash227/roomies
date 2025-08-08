import { AppSidebar } from "@/components/side-bar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function Layout(props: { children: React.ReactNode }) {
	const { children } = props;
	const cookieStore = await cookies();
	const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

	return (
		<SidebarProvider defaultOpen={defaultOpen}>
			<AppSidebar />
			<SidebarTrigger />
			<main className="w-full h-full">{children}</main>
		</SidebarProvider>
	);
}
