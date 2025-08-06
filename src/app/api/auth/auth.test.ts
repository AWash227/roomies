import { testApiHandler } from "next-test-api-route-handler";
import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import * as appHandler from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/db";
import { User } from "@prisma/client";
import { logger } from "@/lib/utils";
import { BASE_URL, TEST_USER, TEST_USER_PASS } from "../test-utils";

describe("Auth", () => {
	let persistedUser: User | null = null;
	beforeAll(async () => {
		try {
			// Add in our test user
			persistedUser = await db.user.create({ data: TEST_USER });
		} catch (e) {
			logger.error(e);
		}
	});
	afterAll(async () => {
		// Remove our test user
		if (!persistedUser) return;
		await db.user.delete({ where: { id: persistedUser.id } });
	});

	test("refuses session to those lacking cookie and token.", async () => {
		await testApiHandler({
			appHandler,
			url: `${BASE_URL}/api/auth/session`,
			test: async ({ fetch }) => {
				const res = await fetch({ method: "GET" });
				expect(res.status).toBe(200);
				expect(await res.text()).toBe("null");
			},
		});
	});

	test("issues csrf token and cookie.", async () => {
		await testApiHandler({
			appHandler,
			url: `${BASE_URL}/api/auth/csrf`,
			test: async ({ fetch }) => {
				const res = await fetch({ method: "GET" });
				const json = await res.json();

				const { csrfToken } = json;

				expect(csrfToken).toBeTruthy();
				expect(res.headers.getSetCookie()).toBeTruthy();
			},
		});
	});

	test("sets up a session once user signs in", async () => {
		const jar = new Map();
		const credentialsForm = new URLSearchParams({
			email: TEST_USER.email,
			password: TEST_USER_PASS,
			callbackUrl: BASE_URL,
		});

		await testApiHandler({
			appHandler,
			url: `${BASE_URL}/api/auth/csrf`,
			test: async ({ fetch }) => {
				const res = await fetch({ method: "GET" });
				const { csrfToken: token } = await res.json();

				for (const sc of res.headers.getSetCookie()) {
					const [pair] = sc.split(";", 1);
					const [name] = pair.split("=");
					jar.set(name, pair);
				}

				// 2) Post to credentials callback with form-encoded body + csrf
				credentialsForm.set("csrfToken", token);
			},
		});

		await testApiHandler({
			appHandler,
			url: `${BASE_URL}/api/auth/callback/credentials`,
			test: async ({ fetch }) => {
				const signinRes = await fetch({
					method: "POST",
					headers: {
						"content-type": "application/x-www-form-urlencoded",
						cookie: Array.from(jar.values()).join("; "),
					},
					body: credentialsForm.toString(),
				});

				for (const sc of signinRes.headers.getSetCookie()) {
					const [pair] = sc.split(";", 1);
					const [name] = pair.split("=", 1);
					jar.set(name, pair);
				}

				expect([302, 303, 307, 308]).toContain(signinRes.status);
			},
		});

		await testApiHandler({
			appHandler,
			url: `${BASE_URL}/api/auth/session`,
			test: async ({ fetch }) => {
				const res = await fetch({
					method: "GET",
					headers: {
						cookie: Array.from(jar.values()).join("; "),
					},
				});

				expect(res.status).toBe(200);
				const session = await res.json();
				expect(session.user.email).toBe(TEST_USER.email);
			},
		});
	});
});
