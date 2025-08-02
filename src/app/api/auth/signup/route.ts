import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { hash } from "argon2";
import { db } from "@/lib/db";
import { logger } from "@/lib/utils";

export const signUpSchema = z.object({
	email: z.email({ error: "Email is required" }).min(1, "Email is required"),
	password: z
		.string({ error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(256, "Password must be less than 256 characters"),
});

export const POST = async (req: NextRequest) => {
	try {
		const { email, password } = signUpSchema.parse(await req.json());
		const passwordHash = await hash(password);

		// Create the user
		const user = await db.user.create({
			data: {
				email,
				passwordHash,
			},
		});

		logger.info("New User added");
		//Sign the user in
		return NextResponse.json({}, { status: 200 });
	} catch (e) {
		logger.error(e);
		if (e instanceof ZodError) {
			return NextResponse.json({}, { status: 400 });
		} else {
			return NextResponse.json({}, { status: 500 });
		}
	}
};
