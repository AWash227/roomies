import z from "zod";

export const createUserSchema = z.object({
	name: z.string().trim(),
	email: z.email().trim(),
	role: z.enum(["STUDENT", "STAFF"]),
});

export const updateUserSchema = z.object({
	name: z.string(),
	email: z.email(),
});
