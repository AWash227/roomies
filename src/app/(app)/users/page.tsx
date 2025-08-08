import { UsersTable } from "@/components/users-table";
import { db } from "@/lib/db";

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
			<h1>Users</h1>
			<UsersTable users={users} />
		</div>
	);
}
