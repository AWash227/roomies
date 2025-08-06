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
import { CreateBuildingDto, EditBuildingDto } from "../schemas";
import { createBuilding, deleteBuilding } from "../api";

describe("/buildings/[id]", () => {
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

	describe("PATCH", () => {
		it("returns 401 UNAUTHORIZED when not logged in", async () => {
			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					const res = await fetch({ method: "PATCH" });
					expect(res.status).toBe(401);
				},
			});
		});

		it("returns 200 OK when editing a pre-existing building", async () => {
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

		it("returns 400 BAD REQUEST when editing a pre-existing building with bad data", async () => {
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
						name: 24,
						numFloors: "CLEARLY BAD NUMBER",
						extraProp: new Date(),
					};

					if (!cookie) return;
					const res = await fetch({
						method: "PATCH",
						body: JSON.stringify(data),
						headers: {
							cookie,
						},
					});

					expect(res.status).toEqual(400);
				},
			});
		});

		it("returns 404 NOT FOUND when editing a non-existent building", async () => {
			testApiHandler({
				appHandler,
				paramsPatcher(params) {
					params.id = crypto.randomUUID();
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

					expect(res.status).toEqual(404);
				},
			});
		});
	});

	describe("DELETE", () => {
		it("returns 401 UNAUTHORIZED when not logged in", async () => {
			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					const res = await fetch({ method: "DELETE" });
					expect(res.status).toBe(401);
				},
			});
		});

		it("returns 200 OK when deleting a pre-existing building", async () => {
			const building = await createBuilding(createFakeBuilding());
			await testApiHandler({
				appHandler,
				paramsPatcher: (params) => {
					params.id = building.id;
				},
				test: async ({ fetch }) => {
					if (!cookie) return;
					const res = await fetch({ method: "DELETE", headers: { cookie } });
					expect(res.status).toBe(200);
				},
			});
		});

		it("returns 404 NOT FOUND when deleting a building that doesn't exist", async () => {
			await testApiHandler({
				appHandler,
				paramsPatcher: (params) => {
					params.id = crypto.randomUUID();
				},
				test: async ({ fetch }) => {
					if (!cookie) return;
					const res = await fetch({ method: "DELETE", headers: { cookie } });
					expect(res.status).toBe(404);
				},
			});
		});
	});

	describe("GET", () => {
		it("returns 401 Unauthorized when not logged in", async () => {
			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					const res = await fetch({ method: "GET" });
					expect(res.status).toBe(401);
				},
			});
		});
		it("returns 200 OK when fetching a pre-existing building", async () => {
			const building = await createBuilding(createFakeBuilding());
			await testApiHandler({
				appHandler,
				paramsPatcher: (params) => {
					params.id = building.id;
				},
				test: async ({ fetch }) => {
					if (!cookie) return;
					const res = await fetch({ method: "GET", headers: { cookie } });
					expect(res.status).toBe(200);
				},
			});

			await deleteBuilding(building.id);
		});

		it("returns 404 NOT FOUND when fetching a non-existent building", async () => {
			await testApiHandler({
				appHandler,
				paramsPatcher: (params) => {
					params.id = crypto.randomUUID(); // <- Crucially this is unlikely to collide w/ a pre-existing building id;
				},
				test: async ({ fetch }) => {
					if (!cookie) return;
					const res = await fetch({ method: "GET", headers: { cookie } });
					expect(res.status).toBe(404);
				},
			});
		});
	});
});
