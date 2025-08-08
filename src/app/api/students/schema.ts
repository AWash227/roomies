import z from "zod";

export const createStudentSchema = z.object({
	firstName: z.string().trim(),
	lastName: z.string().trim(),
	email: z.email().trim().toLowerCase(),
	phoneNumber: z.string().optional(),
});
