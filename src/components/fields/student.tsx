import z from "zod";
import { ErrorText } from "../error-text";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createStudentSchema } from "@/app/api/students/schema";

export const StudentFields = (props: {
	errors: ReturnType<
		typeof z.treeifyError<z.infer<typeof createStudentSchema>>
	>;
	defaultValues?: Partial<z.infer<typeof createStudentSchema>>;
}) => {
	const { errors, defaultValues } = props;

	return (
		<>
			<Label htmlFor="firstName">First Name</Label>
			<Input
				id="firstName"
				name="firstName"
				placeholder="John"
				defaultValue={defaultValues?.firstName}
			/>
			<ErrorText errors={errors.properties?.firstName?.errors} />

			<Label htmlFor="lastName">Last Name</Label>
			<Input
				id="lastName"
				name="lastName"
				placeholder="Doe"
				defaultValue={defaultValues?.lastName}
			/>
			<ErrorText errors={errors.properties?.lastName?.errors} />

			<Label htmlFor="email">Email</Label>
			<Input
				id="email"
				name="email"
				placeholder="john.doe@example.com"
				defaultValue={defaultValues?.email}
			/>
			<ErrorText errors={errors.properties?.email?.errors} />

			<Label htmlFor="phoneNumber">Phone Number</Label>
			<Input
				id="phoneNumber"
				name="phoneNumber"
				placeholder="(555) 555-5555"
				defaultValue={defaultValues?.phoneNumber}
			/>
			<ErrorText errors={errors.properties?.phoneNumber?.errors} />
		</>
	);
};
