import { NextRequest, NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/auth";
import { logger } from "@/lib/utils";
import { db } from "@/lib/db";
import { createBuildingSchema } from "./schemas";

// Get all buildings
export const GET = () => {};

// Create a building
export const POST = async (req: NextRequest) => {
	// Ensure they are logged in
	const session = await auth();
	if (!session)
		return NextResponse.json({ message: "Not Authorized" }, { status: 401 });
	// Ensure they are allowed
	// @TODO: Add in authorization if necessary

	// Validate the data that they sent
	const parsed = createBuildingSchema.safeParse(await req.json());
	if (!parsed.success)
		return NextResponse.json({ message: "Bad Request" }, { status: 400 });

	const { data } = parsed;

	// Perform the operation
	try {
		const building = await db.building.create({
			data: {
				name: data.name,
				numFloors: data.numFloors,
				address: { create: data.address },
			},
			include: {
				address: true,
				floors: true,
			},
		});
		return NextResponse.json(building, { status: 201 });
	} catch (e) {
		logger.error(e);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
};
