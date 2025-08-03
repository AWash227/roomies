import z from "zod";

export const updateUserSchema = z.object({
	name: z.string(),
	email: z.email(),
});
