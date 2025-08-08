import { testApiHandler } from "next-test-api-route-handler";
import { afterAll, beforeAll, describe, expect, it } from "bun:test";
import z from "zod";
import { createStudentSchema } from "./schema";
import { fakerEN_US as f } from "@faker-js/faker";
import * as appHandler from "./route";
import {
	createTestUser,
	deleteTestUser,
	loginAndGetTestUserCookies,
} from "../test-utils";
import type { User } from "@prisma/client";

const createFakeStudent = (): z.infer<typeof createStudentSchema> => ({
	firstName: f.person.firstName(),
	lastName: f.person.lastName(),
	email: f.internet.email(),
	phoneNumber: f.phone.number({ style: "national" }),
});

describe("/students", () => {
	let cookie: string | null = null;
	let user: User | null = null;

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
		it("returns 401 UNAUTHORIZED when attempting without login", async () => {
			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					const res = await fetch({ method: "POST" });

					expect(res.status).toEqual(401);
				},
			});
		});

		it("returns 200 OK when you send a valid student body", async () => {
			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					if (!cookie) return;
					const res = await fetch({
						method: "POST",
						headers: {
							cookie,
						},
						body: JSON.stringify(createFakeStudent()),
					});

					expect(res.status).toEqual(201);
				},
			});
		});

		it("returns 400 BAD REQUEST when you send an invalid body", async () => {
			await testApiHandler({
				appHandler,
				test: async ({ fetch }) => {
					if (!cookie) return;
					const res = await fetch({
						method: "POST",
						headers: {
							cookie,
						},
						body: JSON.stringify({
							...createFakeStudent(),
							fieldShouldNotExist: 24,
							email: 2425255,
							firstName: true,
						}),
					});

					expect(res.status).toEqual(400);
				},
			});
		});
	});
});
