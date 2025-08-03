import { NextRequest, NextResponse } from "next/server";
import { updateUserSchema } from "./update-user.schema";
import { db } from "@/lib/db";

export const POST = async (
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) => {
	const { id } = await params;
	const body = await req.json();
	const parsed = updateUserSchema.safeParse(body);
	if (parsed.success) {
		try {
			const user = await db.user.update({ where: { id }, data: parsed.data });
			return NextResponse.json(
				{
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image,
				},
				{ status: 200 },
			);
		} catch (e) {
			console.error(e);
			return NextResponse.json({}, { status: 500 });
		}
	} else {
		return NextResponse.json({}, { status: 400 });
	}
};
