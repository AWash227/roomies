import { NextRequest, NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { hash } from "argon2";
import { db } from "@/lib/db";
import { logger } from "@/lib/utils";
import { signUpSchema } from "../schema";
import { errorResponse } from "../../errors";

export const POST = async (req: NextRequest) => {
	try {
		const parsed = signUpSchema.safeParse(await req.json());
		if (!parsed.success)
			return errorResponse("BAD_REQUEST", {
				errors: z.treeifyError(parsed.error),
			});

		const existingUser = await db.user.findUnique({
			where: { email: parsed.data.email },
		});
		if (existingUser) return errorResponse("EMAIL_TAKEN");

		const { email, password } = parsed.data;
		const passwordHash = await hash(password);

		// Create the user
		const user = await db.user.create({
			data: {
				email,
				passwordHash,
			},
		});

		//Sign the user in
		return NextResponse.json({ message: "Sign up successful." });
	} catch (e) {
		logger.error(e);
		// catch a unique violation error which would mean the email is already in use

		return errorResponse("INTERNAL_SERVER_ERROR");
	}
};
