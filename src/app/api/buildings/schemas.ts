import z from "zod";

export const idSchema = z.strictObject({ id: z.string() });

export const createAddressSchema = z.object({
	street1: z.string().min(1, { error: "Please enter a street address" }),
	street2: z.string().nullable(),
	city: z.string().nullable(),
	state: z
		.string()
		.min(1, { error: "Please enter a state" })
		.max(2, { error: "Please use the abbreviation (2 characters)" }),
	zip: z
		.string()
		.min(5, { error: "Please enter a 5 digit zip code" })
		.max(5, { error: "Please enter a 5 digit zip code" }),
});
export type CreateAddressDto = z.infer<typeof createAddressSchema>;

export const createBuildingSchema = z.object({
	name: z.string().default(""),
	numFloors: z.coerce
		.number()
		.min(1, { error: "A building must have at least 1 floor" }),
	address: createAddressSchema,
});
export type CreateBuildingDto = z.infer<typeof createBuildingSchema>;

export const editBuildingSchema = createBuildingSchema.partial();
export type EditBuildingDto = z.infer<typeof editBuildingSchema>;
