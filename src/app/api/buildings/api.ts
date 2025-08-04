import { db } from "@/lib/db";
import { CreateBuildingDto, EditBuildingDto } from "./schemas";
import { NextResponse } from "next/server";
import { logger } from "@/lib/utils";
import { Prisma, PrismaClient } from "@prisma/client";

export const getBuildings = async () => {
	return await db.building.findMany({
		include: { address: true, floors: true },
	});
};

export const createBuilding = async (data: CreateBuildingDto) => {
	return await db.building.create({
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
};

export const editBuilding = async (id: string, data: EditBuildingDto) => {
	try {
		const building = await db.building.findFirst({
			where: { id },
			include: { address: true },
		});
		if (!building)
			return NextResponse.json(
				{ message: "Building not found" },
				{ status: 404 },
			);

		const newBuilding: Prisma.BuildingUpdateInput = {
			name: data.name ?? building.name,
			numFloors: data.numFloors ?? building.numFloors,
			address: {
				update: {
					street1: data.address?.street1 ?? building.address?.street1,
					street2: data.address?.street2 ?? building.address?.street2,
					city: data.address?.city ?? building.address?.city,
					state: data.address?.state ?? building.address?.state,
					zip: data.address?.zip ?? building.address?.zip,
				},
			},
		};

		const updated = await db.building.update({
			where: { id },
			data: newBuilding,
			include: { address: true, floors: true },
		});
		return updated;
	} catch (e) {
		console.error(e);
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
};
