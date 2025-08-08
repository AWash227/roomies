import z from "zod";
import { ErrorText } from "../error-text";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createUserSchema } from "@/app/api/users/schemas";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/select";

export const UserFields = (props: {
	errors: ReturnType<typeof z.treeifyError<z.infer<typeof createUserSchema>>>;
	defaultValues?: Partial<z.infer<typeof createUserSchema>>;
}) => {
	const { errors, defaultValues } = props;

	return (
		<>
			<Label htmlFor="role">Role</Label>
			<Select name="role" defaultValue={defaultValues?.role ?? "STUDENT"}>
				<SelectTrigger id="role" className="w-[180px]">
					<SelectValue placeholder="Select a role..." />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="STUDENT">Student</SelectItem>
					<SelectItem value="STAFF">Staff</SelectItem>
				</SelectContent>
			</Select>
			<ErrorText errors={errors.properties?.role?.errors} />
			<Label htmlFor="name">Name</Label>
			<Input
				id="name"
				name="name"
				placeholder="John Doe"
				defaultValue={defaultValues?.name}
			/>
			<ErrorText errors={errors.properties?.name?.errors} />

			<Label htmlFor="email">Email</Label>
			<Input
				id="email"
				name="email"
				placeholder="john.doe@example.com"
				defaultValue={defaultValues?.email}
			/>
			<ErrorText errors={errors.properties?.email?.errors} />

			<Label htmlFor="role">Role</Label>
		</>
	);
};
