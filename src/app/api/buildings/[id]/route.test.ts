import { testApiHandler } from "next-test-api-route-handler";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import {
	createFakeBuilding,
	createTestUser,
	deleteTestUser,
	loginAndGetTestUserCookies,
} from "../../test-utils";
import { Building, User } from "@prisma/client";
import * as appHandler from "./route";
import {
	CreateBuildingDto,
	createBuildingSchema,
	EditBuildingDto,
	editBuildingSchema,
} from "../schemas";
import z from "zod";
import { createBuilding } from "../api";

describe("Building Edit", () => {
	let user: User | null = null;
	let cookie: string | null = null;

	beforeAll(async () => {
		user = (await createTestUser()) ?? null;
		cookie = await loginAndGetTestUserCookies();
		expect(cookie).toBeTruthy();
	});

	afterAll(async () => {
		if (!user) return;
		await deleteTestUser(user.id);
	});

	it("returns 200 OK if a valid edit is passed and the user is logged in", async () => {
		const buildingDto: CreateBuildingDto = createFakeBuilding();
		const building = await createBuilding(buildingDto);
		if (!building) return;

		testApiHandler({
			appHandler,
			paramsPatcher(params) {
				params.id = building.id;
			},
			test: async ({ fetch }) => {
				const data = {
					name: "NEW NAME",
					numFloors: 3,
				} satisfies EditBuildingDto;

				if (!cookie) return;
				const res = await fetch({
					method: "PATCH",
					body: JSON.stringify(data),
					headers: {
						cookie,
					},
				});

				expect(res.status).toEqual(200);
				const body = (await res.json()) as Building;

				expect(body.name).toEqual(data.name);
				expect(body.numFloors).toEqual(data.numFloors);
			},
		});
	});
});
