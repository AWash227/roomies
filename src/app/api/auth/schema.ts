import z from "zod";

export const signUpSchema = z.object({
	email: z
		.email({ error: "Email is required" })
		.min(1, "Email is required")
		.trim()
		.toLowerCase(),
	password: z
		.string({ error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(256, "Password must be less than 256 characters"),
});

export const signInSchema = z.object({
	email: z.string().trim(),
	password: z.string(),
});

export const signInSearchParamsSchema = z.object({
	callbackUrl: z.string().optional(),
});
