import { testApiHandler } from "next-test-api-route-handler";
import { hash } from "argon2";
import { NextRequest } from "next/server";
import { GET, POST } from "./auth/[...nextauth]/auth";
import { logger } from "@/lib/utils";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";

export const BASE_URL = "http://localhost:3000";
export const TEST_USER_PASS = "testing123";
export const TEST_USER = {
	email: "test@email.com",
	name: "TEST USER",
	passwordHash: await hash(TEST_USER_PASS),
};

export const createTestUser = async () => {
	try {
		// Add in our test user
		return await db.user.create({ data: TEST_USER });
	} catch (e) {
		// if we
		if (
			e instanceof Prisma.PrismaClientKnownRequestError &&
			e.code === "P2002"
		) {
			return await db.user.findUnique({ where: { email: TEST_USER.email } });
		} else {
			console.error(e);
		}
	}
};

export const deleteTestUser = async (id: string) => {
	try {
		await db.user.delete({ where: { id } });
	} catch (e) {
		console.error(e);
	}
};

export const loginAndGetTestUserCookies = async () => {
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
	return Array.from(jar.values()).join("; ");
};
