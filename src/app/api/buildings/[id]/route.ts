import z from "zod";
import { createBuildingSchema, editBuildingSchema } from "../schemas";
import { auth } from "../../auth/[...nextauth]/auth";
import { NextRequest, NextResponse } from "next/server";
import { editBuilding, getBuilding } from "../api";
import { db } from "@/lib/db";
import { logger } from "@/lib/utils";

export const GET = async (
	_: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;

	try {
		const building = await getBuilding(id);
		return NextResponse.json(building);
	} catch (e) {
		logger.error(e);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
};

// Edit a building
export const PATCH = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;
	const data = await req.json();
	// logged in?
	const session = await auth();
	if (!session)
		return NextResponse.json(
			{ message: "You are not logged in." },
			{ status: 401 },
		);

	// parsed?
	const parsed = editBuildingSchema.safeParse(data);
	if (!parsed.success)
		return NextResponse.json({ message: "Invalid data" }, { status: 400 });

	// op
	return NextResponse.json(await editBuilding(id, parsed.data), {
		status: 200,
	});
};

// Deleting a building
export const DELETE = () => {};
