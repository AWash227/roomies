import { test, expect, describe, beforeAll, afterAll } from "bun:test";
import { GET, POST } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest } from "next/server";
import { hash } from "argon2";
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
		const res = await GET(new NextRequest(`${BASE_URL}/api/auth/session`));
		expect(res.status).toBe(200);
		expect(await res.text()).toBe("null");
	});

	test("issues csrf token and cookie.", async () => {
		const res = await GET(new NextRequest(`${BASE_URL}/api/auth/csrf`));
		const json = await res.json();

		const { csrfToken } = json;

		expect(csrfToken).toBeTruthy();
		expect(res.headers.getSetCookie()).toBeTruthy();
	});

	test("sets up a session once user signs in", async () => {
		const jar = new Map();
		const res = await GET(new NextRequest(`${BASE_URL}/api/auth/csrf`));
		const { csrfToken: token } = await res.json();
		let cookies = res.headers.getSetCookie();
		for (const sc of cookies) {
			const [pair] = sc.split(";", 1);
			const [name] = pair.split("=");
			jar.set(name, pair);
		}

		// 2) Post to credentials callback with form-encoded body + csrf
		const form = new URLSearchParams({
			email: TEST_USER.email,
			password: TEST_USER_PASS,
			csrfToken: token,
			callbackUrl: BASE_URL,
		});

		const signinRes = await POST(
			new NextRequest(`${BASE_URL}/api/auth/callback/credentials`, {
				method: "POST",
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					cookie: Array.from(jar.values()).join("; "),
				},
				body: form.toString(),
			}),
		);

		for (const sc of signinRes.headers.getSetCookie()) {
			const [pair] = sc.split(";", 1);
			const [name] = pair.split("=", 1);
			jar.set(name, pair);
		}

		expect([302, 303, 307, 308]).toContain(signinRes.status);

		const sessionRes = await GET(
			new NextRequest(`${BASE_URL}/api/auth/session`, {
				headers: { cookie: Array.from(jar.values()).join("; ") },
			}),
		);
		expect(sessionRes.status).toBe(200);
		const session = await sessionRes.json();
		expect(session.user.email).toBe(TEST_USER.email);

		await POST(
			new NextRequest(`${BASE_URL}/api/auth/signout`, {
				headers: { cookie: Array.from(jar.values()).join("; ") },
			}),
		);
	});
});
