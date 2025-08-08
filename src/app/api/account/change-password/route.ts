import { NextRequest, NextResponse } from "next/server";
import { changePasswordSchema } from "./schema";
import { db } from "@/lib/db";
import { hash, verify } from "argon2";
import { auth } from "../../auth/[...nextauth]/auth";
import { errorResponse } from "../../errors";

// @TODO: ensure the user who owns the account is the only one who can change their password
export const POST = async (req: NextRequest) => {
	const session = await auth();
	if (!session || !session.user || !session.user.id)
		return errorResponse("UNAUTHENTICATED");

	const { id } = session.user;
	const data = await req.json();
	const parsed = await changePasswordSchema.safeParseAsync(data);

	if (parsed.success) {
		const user = await db.user.findUnique({ where: { id } });
		if (!user || !user.passwordHash)
			return errorResponse("BAD_REQUEST", {
				error: {
					errors: [
						"Cannot change password for user without a pre-existing password",
					],
				},
			});

		const isVerified = await verify(
			user.passwordHash,
			parsed.data.currentPassword,
		);
		if (isVerified) {
			const passwordHash = await hash(parsed.data.password);
			await db.user.update({
				where: { id },
				data: { passwordHash },
			});
			return NextResponse.json({}, { status: 200 });
		} else {
			return NextResponse.json({}, { status: 403 });
		}
	} else {
		return NextResponse.json({}, { status: 400 });
	}
};
