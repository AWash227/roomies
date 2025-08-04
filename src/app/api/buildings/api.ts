import { db } from "@/lib/db";
import { CreateBuildingDto } from "./schemas";
import { NextResponse } from "next/server";
import { logger } from "@/lib/utils";

export const getBuildings = async () => {
	return await db.building.findMany({
		include: { address: true, floors: true },
	});
};

export const createBuilding = async (data: CreateBuildingDto) => {
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
