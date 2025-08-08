import { NextResponse } from "next/server";

export const ERRORS = {
	UNAUTHENTICATED: {
		code: "UNAUTHENTICATED",
		message: "You must be logged in to perform this action.",
		status: 401,
	},
	UNAUTHORIZED: {
		code: "UNAUTHORIZED",
		message: "You are not authorized to perform this action.",
		status: 403,
	},
	BAD_REQUEST: {
		code: "BAD_REQUEST",
		message: "The provided data is not valid.",
		status: 400,
	},
	NOT_FOUND: {
		code: "NOT_FOUND",
		message: "The resource could not be found.",
		status: 404,
	},
	INTERNAL_SERVER_ERROR: {
		code: "INTERNAL_SERVER_ERROR",
		message: "The server experienced an error. Please try again.",
		status: 500,
	},
	INVALID_ID: {
		code: "INVALID_ID",
		message: "The provided ID is not valid.",
		status: 400,
	},
	INVALID_SEARCH_PARAMS: {
		code: "INVALID_SEARCH_PARAMS",
		message: "The provided search parameters were not valid.",
		status: 400,
	},
	EMAIL_TAKEN: {
		code: "EMAIL_TAKEN",
		message:
			"The email you are attempting to use is already in use. Try signing in instead.",
		status: 409,
	},
};

export function errorResponse(
	err: keyof typeof ERRORS,
	extra?: Record<string, any>,
) {
	const base = ERRORS[err];
	return NextResponse.json(
		{ error: base.code, message: base.message, ...extra },
		{ status: base.status },
	);
}
