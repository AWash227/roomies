import z from "zod";

export const changePasswordSchema = z
	.object({
		currentPassword: z.string(),
		password: z
			.string()
			.min(1, { error: "Password is required" })
			.min(8, { error: "Minimum password length is 8" })
			.max(256, {
				error: "Password should be less than or equal to 256 chars",
			}),
		passwordConfirm: z.string(),
	})
	.refine((data) => data.password === data.passwordConfirm, {
		error: "Passwords don't match",
		path: ["passwordConfirm"],
	});
