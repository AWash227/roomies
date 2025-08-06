import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth/[...nextauth]/auth";
import { errorResponse } from "./errors";

export const withAuthn =
	(fn: any) =>
	async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
		const session = await auth();
		if (!session) return errorResponse("UNAUTHENTICATED");

		return await fn(req, { params });
	};
