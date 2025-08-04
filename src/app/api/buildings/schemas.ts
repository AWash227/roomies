import z from "zod";

export const createAddressSchema = z.object({
	street1: z.string(),
	street2: z.string().nullable(),
	city: z.string().nullable(),
	state: z.string(),
	zip: z.string(),
});
export type CreateAddressDto = z.infer<typeof createAddressSchema>;

export const createBuildingSchema = z.object({
	name: z.string().default(""),
	numFloors: z.coerce.number(),
	address: createAddressSchema,
});
export type CreateBuildingDto = z.infer<typeof createBuildingSchema>;
