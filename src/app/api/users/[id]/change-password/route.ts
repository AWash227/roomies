import { NextRequest, NextResponse } from "next/server";
import { changePasswordSchema } from "./schema";
import { db } from "@/lib/db";
import { hash, verify } from "argon2";

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;
	const data = await req.json();
	const parsed = await changePasswordSchema.safeParseAsync(data);

	if (parsed.success) {
		const user = await db.user.findUnique({ where: { id } });
		if (!user || !user.passwordHash)
			// TODO: if the user doesn't already have a current password, what should we do here?
			return NextResponse.json({}, { status: 404 }); // Best Practice?

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
