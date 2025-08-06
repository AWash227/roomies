import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/utils";
import { createBuildingSchema } from "./schemas";
import { createBuilding, getBuildings } from "./api";
import { withAuthn } from "../utils";
import { errorResponse } from "../errors";

// Get all buildings
export const GET = withAuthn(async () => {
	return NextResponse.json(await getBuildings());
});

// Create a building
export const POST = withAuthn(async (req: NextRequest) => {
	const parsed = createBuildingSchema.safeParse(await req.json());
	if (!parsed.success) return errorResponse("BAD_REQUEST");
	const { data } = parsed;

	try {
		const building = await createBuilding(data);
		return NextResponse.json(building, { status: 201 });
	} catch (e) {
		logger.error(e);
		return errorResponse("INTERNAL_SERVER_ERROR");
	}
});
