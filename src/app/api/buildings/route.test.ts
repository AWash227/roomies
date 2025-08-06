import { testApiHandler } from "next-test-api-route-handler";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import * as appHandler from "./route";
import { CreateBuildingDto } from "./schemas";
import { fakerEN_US as f } from "@faker-js/faker";
import {
	createTestUser,
	deleteTestUser,
	loginAndGetTestUserCookies,
} from "../test-utils";
import type { User } from "@prisma/client";

describe("/buildings", () => {
	let cookie: string | null = null;
	let user: User | null = null;
	let buildingId: string | null = null;

	beforeAll(async () => {
		user = (await createTestUser()) ?? null;
		if (!user) return;
		cookie = await loginAndGetTestUserCookies();
		expect(cookie).toBeTruthy();
	});

	afterAll(async () => {
		if (user) {
			await deleteTestUser(user.id);
		}
	});

	describe("POST", () => {
		it("returns 401 UNAUTHORIZED if you are not logged in", async () => {
			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					const res = await fetch({ method: "POST" });
					expect(res.status).toBe(401);
				},
			});
		});

		it("returns 200 OK if you send a valid payload", async () => {
			const state = f.location.state({ abbreviated: true });

			const body: CreateBuildingDto = {
				name: `${f.person.lastName()} ${f.helpers.arrayElement(["Hall", "Theater", "Library"])}`,
				address: {
					street1: f.location.streetAddress(),
					street2: f.location.secondaryAddress(),
					city: f.location.city(),
					state,
					zip: f.location.zipCode({ state }),
				},
				numFloors: f.number.int({ min: 1, max: 256 }),
			};

			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					if (!cookie) return;
					const res = await fetch({
						method: "POST",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
							cookie: cookie,
						},
					});
					expect(res.status).toBe(201);
					const data = await res.json();
					buildingId = data.id;
				},
			});
		});

		it("returns 400 BAD REQUEST if you send an invalid payload", async () => {
			const body = {
				name: 123,
				address: {
					city: f.location.city(),
				},
				numFloors: f.number.int({ min: 1, max: 256 }),
				extraFieldThatShouldntBeHere: 92,
			};

			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					if (!cookie) return;
					const res = await fetch({
						method: "POST",
						body: JSON.stringify(body),
						headers: {
							"Content-Type": "application/json",
							cookie: cookie,
						},
					});
					expect(res.status).toBe(400);
				},
			});
		});
	});

	describe("GET", () => {
		it("returns 401 UNAUTHORIZED if you are not logged in", async () => {
			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					const res = await fetch({ method: "GET" });
					expect(res.status).toBe(401);
				},
			});
		});

		it("returns 200 OK if you fetch buildings", async () => {
			expect(buildingId).toBeTruthy();
			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					if (!cookie) return;
					const res = await fetch({ method: "GET", headers: { cookie } });
					expect(res.status).toBe(200);
				},
			});
		});
	});
});
