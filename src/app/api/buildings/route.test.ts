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

describe("Building Create", () => {
	let cookie: string | null = null;
	let user: User | null = null;

	beforeAll(async () => {
		user = (await createTestUser()) ?? null;
		if (!user) return;
		cookie = await loginAndGetTestUserCookies();
	});

	afterAll(async () => {
		if (user) {
			await deleteTestUser(user.id);
		}
	});

	it("returns 200 OK if you send a valid payload while logged in", async () => {
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
				expect(cookie).toBeTruthy();
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
			},
		});
	});
});
