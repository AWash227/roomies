import { NextRequest, NextResponse } from "next/server";
import { updateUserSchema } from "../schemas";
import { db } from "@/lib/db";
import { logger } from "@/lib/utils";
import { withAuthn } from "../../utils";

export const GET = withAuthn(
	async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
		const { id } = await params;
		const user = await db.user.findUnique({ where: { id } });
		return NextResponse.json(user);
	},
);

export const PUT = withAuthn(
	async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
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
				logger.error(e);
				return NextResponse.json({}, { status: 500 });
			}
		} else {
			return NextResponse.json({}, { status: 400 });
		}
	},
);

// @TODO: Ensure the user is who they say they are before deleting
export const DELETE = withAuthn(
	async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
		const { id } = await params;

		try {
			const user = await db.user.delete({ where: { id } });
			return NextResponse.json({}, { status: 200 });
		} catch (e) {
			logger.error(e);
			return NextResponse.json({}, { status: 500 });
		}
	},
);
