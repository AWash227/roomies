import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { errorResponse } from "../errors";
import { db } from "@/lib/db";
import { createUserSchema } from "./schemas";
import { withAuthn } from "../utils";
import { Prisma } from "@prisma/client";

const userSelect = {
	id: true,
	name: true,
	email: true,
	role: true,
} satisfies Prisma.UserSelect;
export type UserPayload = Prisma.UserGetPayload<{ select: typeof userSelect }>;

// create user
export const POST = withAuthn(async (req: NextRequest) => {
	const data = await req.json();
	const parsed = createUserSchema.safeParse(data);
	if (!parsed.success)
		return errorResponse("BAD_REQUEST", {
			errors: z.treeifyError(parsed.error),
		});
	try {
		const user = await db.user.create({ data: parsed.data });
		return NextResponse.json(
			{
				id: user.id,
				name: user.name,
				email: user.email,
			},
			{ status: 201 },
		);
	} catch (e) {
		return errorResponse("INTERNAL_SERVER_ERROR");
	}
});

// fetch a list of users
export const GET = withAuthn(async () => {
	const users = await db.user.findMany({
		select: userSelect,
	});
	return NextResponse.json(users);
});
