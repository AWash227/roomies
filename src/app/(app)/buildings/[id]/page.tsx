import { auth, signIn } from "@/app/api/auth/[...nextauth]/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const session = await auth();
	if (!session) signIn();

	const building = await db.building.findUnique({
		where: { id },
		include: { floors: true, address: true },
	});

	if (!building) return notFound();
	return (
		<div>
			<h1>{building?.name}</h1>
			<ul>
				{building.floors.map((floor) => (
					<li key={floor.id}>{floor.code}</li>
				))}
			</ul>
		</div>
	);
}
