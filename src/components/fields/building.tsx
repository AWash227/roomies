import type {
	CreateBuildingDto,
	EditBuildingDto,
} from "@/app/api/buildings/schemas";
import { ErrorText } from "../error-text";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import type z from "zod";

export const BuildingFields = (props: {
	defaultValues?: EditBuildingDto;
	errors: ReturnType<typeof z.treeifyError<CreateBuildingDto>>;
}) => {
	const { errors, defaultValues } = props;
	return (
		<>
			<Label htmlFor="name">Name</Label>
			<Input
				id="name"
				name="name"
				placeholder="Name"
				defaultValue={defaultValues?.name}
			/>
			<ErrorText errors={errors.properties?.name?.errors} />

			<Label htmlFor="numFloors">Number of Floors</Label>
			<Input
				type="number"
				name="numFloors"
				placeholder="2"
				defaultValue={defaultValues?.numFloors}
			/>
			<ErrorText errors={errors.properties?.numFloors?.errors} />

			<p className="text-muted-foreground font-bold text-xs">Address</p>
			<Label htmlFor="address.street1">Street 1</Label>
			<Input
				id="address.street1"
				name="address.street1"
				placeholder="123 Main St."
				defaultValue={defaultValues?.address?.street1}
			/>
			<ErrorText
				errors={errors.properties?.address?.properties?.street1?.errors}
			/>

			<Label htmlFor="address.street2">Street 2</Label>
			<Input
				id="address.street2"
				name="address.street2"
				placeholder="Apt. 101"
				defaultValue={defaultValues?.address?.street2 ?? undefined}
			/>
			<ErrorText
				errors={errors.properties?.address?.properties?.street2?.errors}
			/>

			<Label htmlFor="address.city">City</Label>
			<Input
				id="address.city"
				name="address.city"
				placeholder="New York"
				defaultValue={defaultValues?.address?.city ?? undefined}
			/>
			<ErrorText
				errors={errors.properties?.address?.properties?.city?.errors}
			/>

			<Label htmlFor="address.state">State</Label>
			<Input
				id="address.state"
				name="address.state"
				placeholder="NY"
				defaultValue={defaultValues?.address?.state ?? undefined}
			/>
			<ErrorText
				errors={errors.properties?.address?.properties?.state?.errors}
			/>

			<Label htmlFor="address.zip">Zip</Label>
			<Input
				id="address.zip"
				name="address.zip"
				placeholder="52352"
				defaultValue={defaultValues?.address?.zip ?? undefined}
			/>
			<ErrorText errors={errors.properties?.address?.properties?.zip?.errors} />
		</>
	);
};
