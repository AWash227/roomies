import { UserCreateForm } from "@/components/forms/user-create-form";
import { InteractiveUsersTable } from "@/components/tables/interactive-users-table";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { db } from "@/lib/db";
import { PlusCircleIcon } from "lucide-react";

export default async function Page() {
	const users = await db.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
		},
	});

	return (
		<div>
			<div className="flex justify-between p-2">
				<h1>Users</h1>
				<Dialog>
					<DialogTrigger asChild>
						<Button size="sm">
							<PlusCircleIcon /> Create User
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create User</DialogTitle>
						</DialogHeader>
						<UserCreateForm />
					</DialogContent>
				</Dialog>
			</div>
			<InteractiveUsersTable users={users} />
		</div>
	);
}
