import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { hash } from "argon2";
import { db } from "@/lib/db";
import { logger } from "@/lib/utils";
import { signUpSchema } from "../schema";

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
