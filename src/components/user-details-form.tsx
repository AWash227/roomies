"use client";

import { EditIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import z, { ZodFormattedError } from "zod";
import React, { FormEvent } from "react";
import { $ZodFlattenedError, $ZodFormattedError } from "zod/v4/core";

const accountDetailsSchema = z.object({
	name: z.string(),
	email: z.email(),
});

export const UserDetailsForm = (props: {
	id: string;
	defaultValues: z.infer<typeof accountDetailsSchema>;
}) => {
	const { id, defaultValues } = props;
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [errors, setErrors] = React.useState<
		ReturnType<typeof z.treeifyError<z.infer<typeof accountDetailsSchema>>>
	>({ errors: [] });

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData.entries());
		const parsed = accountDetailsSchema.safeParse(data);
		if (parsed.success) {
			setIsSubmitting(true);
			await fetch(`/api/users/${id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(parsed.data),
			});
			setIsSubmitting(false);
		} else {
			setErrors(z.treeifyError(parsed.error));
		}
	};

	return (
		<form className="space-y-2" onSubmit={onSubmit}>
			<Input name="name" placeholder="Name" defaultValue={defaultValues.name} />
			<p className="text-xs text-destructive">
				{errors?.properties?.name
					? errors?.properties?.name.errors.map((e) => e.toString())
					: null}
			</p>
			<Input
				name="email"
				placeholder="Email"
				defaultValue={defaultValues.email}
			/>
			<p className="text-xs text-destructive">
				{errors?.properties?.email
					? errors?.properties?.email.errors.map((e) => e.toString())
					: null}
			</p>
			<Button size="sm" type="submit" disabled={isSubmitting}>
				{isSubmitting ? (
					<LoaderCircleIcon className="animate-spin" />
				) : (
					<EditIcon />
				)}{" "}
				Change Details
			</Button>
		</form>
	);
};
