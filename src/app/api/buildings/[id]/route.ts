import { editBuildingSchema, idSchema } from "../schemas";
import { NextRequest, NextResponse } from "next/server";
import { deleteBuilding, editBuilding, getBuilding } from "../api";
import { logger } from "@/lib/utils";
import { withAuthn } from "../../utils";
import { errorResponse } from "../../errors";
import z from "zod";

export const GET = withAuthn(
	async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
		const parameters = idSchema.safeParse(await params);
		if (!parameters.success) return errorResponse("INVALID_ID");
		const { id } = parameters.data;

		try {
			const building = await getBuilding(id);
			if (!building) return errorResponse("NOT_FOUND");
			return NextResponse.json(building);
		} catch (e) {
			logger.error(e);
			return errorResponse("INTERNAL_SERVER_ERROR");
		}
	},
);

// Edit a building
export const PATCH = withAuthn(
	async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
		const parameters = idSchema.safeParse(await params);
		if (!parameters.success) return errorResponse("INVALID_ID");
		const { id } = parameters.data;

		const data = await req.json();

		// parsed?
		const parsed = editBuildingSchema.safeParse(data);
		if (!parsed.success)
			return errorResponse("BAD_REQUEST", {
				errors: z.treeifyError(parsed.error),
			});

		// op
		const building = await editBuilding(id, parsed.data);
		if (!building) return errorResponse("NOT_FOUND");

		return NextResponse.json(building);
	},
);

// Deleting a building
export const DELETE = withAuthn(
	async (_: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
		const parameters = idSchema.safeParse(await params);
		if (!parameters.success) return errorResponse("INVALID_ID");
		const { id } = parameters.data;

		try {
			const building = await deleteBuilding(id);
			return NextResponse.json(building);
		} catch (e) {
			if (e && typeof e === "object" && "code" in e && e.code === "P2025")
				return errorResponse("NOT_FOUND");

			logger.error(e);
			return errorResponse("INTERNAL_SERVER_ERROR");
		}
	},
);
