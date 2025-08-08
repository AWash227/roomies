import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { errorResponse } from "../errors";
import { db } from "@/lib/db";
import { logger } from "@/lib/utils";
import { createStudentSchema } from "./schema";
import { withAuthn } from "../utils";

// list students
export const GET = () => {};

// create a new student
export const POST = withAuthn(async (req: NextRequest) => {
	const data = await req.json();
	const parsed = createStudentSchema.safeParse(data);
	if (!parsed.success)
		return errorResponse("BAD_REQUEST", {
			error: z.treeifyError(parsed.error),
		});

	try {
		const student = await db.student.create({ data: parsed.data });
		return NextResponse.json(student, { status: 201 });
	} catch (e) {
		logger.error(e);
		return errorResponse("INTERNAL_SERVER_ERROR");
	}
});
