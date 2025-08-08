import { NextRequest, NextResponse } from "next/server";
import { signInSchema, signInSearchParamsSchema } from "../schema";
import { errorResponse } from "../../errors";
import z from "zod";
import { signIn } from "../[...nextauth]/auth";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";

const SIGNIN_ERROR_URL = "/auth-error";

export const POST = async (req: NextRequest) => {
	try {
		const urlSearchParams = req.nextUrl.searchParams;
		const searchParams = Object.fromEntries(urlSearchParams.entries());
		const parsedSearchParams = signInSearchParamsSchema.safeParse(searchParams);
		if (!parsedSearchParams.success)
			return errorResponse("INVALID_SEARCH_PARAMS", {
				errors: z.treeifyError(parsedSearchParams.error),
			});

		const data = await req.json();
		const parsed = signInSchema.safeParse(data);
		if (!parsed.success)
			return errorResponse("BAD_REQUEST", {
				errors: z.treeifyError(parsed.error),
			});

		const { email, password } = parsed.data;

		const redirectTo = parsedSearchParams.data.callbackUrl ?? "/";
		await signIn("credentials", {
			email,
			password,
			redirectTo,
			redirect: false,
		});

		const url = new URL(redirectTo, req.url);
		return NextResponse.redirect(url, { status: 303 });
	} catch (error) {
		if (error instanceof AuthError) {
			return NextResponse.redirect(`${SIGNIN_ERROR_URL}?error=${error.type}`, {
				status: 303,
			});
		}
		throw error;
	}
};
