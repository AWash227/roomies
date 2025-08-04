"use client";
import React, { FormEvent } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { unflatten } from "flat";
import {
	CreateBuildingDto,
	createBuildingSchema,
} from "@/app/api/buildings/schemas";
import z from "zod";
import { LoaderCircleIcon, PlusCircleIcon } from "lucide-react";
import { ErrorText } from "./error-text";
import { toast } from "sonner";

export const BuildingCreateForm = () => {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [errors, setErrors] = React.useState<
		ReturnType<typeof z.treeifyError<CreateBuildingDto>>
	>({ errors: [] });

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = unflatten(Object.fromEntries(formData.entries()));
		const parsed = createBuildingSchema.safeParse(data);
		if (!parsed.success) {
			setErrors(z.treeifyError(parsed.error));
			return;
		}

		setIsSubmitting(true);
		const res = await fetch("/api/buildings", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parsed.data),
		});
		setIsSubmitting(false);
		if (res.status === 201) {
			toast.success("Successfully created building.");
			form.reset();
		} else {
			toast.error("Failed to create building.");
		}

		console.log(data);
	};

	return (
		<form onSubmit={onSubmit} className="space-y-2">
			<Label htmlFor="name">Name</Label>
			<Input id="name" name="name" placeholder="Name" />
			<ErrorText errors={errors.properties?.name?.errors} />

			<Label htmlFor="numFloors">Number of Floors</Label>
			<Input type="number" name="numFloors" placeholder="2" />
			<ErrorText errors={errors.properties?.numFloors?.errors} />

			<p className="text-muted-foreground font-bold text-xs">Address</p>
			<Label htmlFor="address.street1">Street 1</Label>
			<Input
				id="address.street1"
				name="address.street1"
				placeholder="123 Main St."
			/>
			<ErrorText
				errors={errors.properties?.address?.properties?.street1?.errors}
			/>

			<Label htmlFor="address.street2">Street 2</Label>
			<Input
				id="address.street2"
				name="address.street2"
				placeholder="Apt. 101"
			/>
			<ErrorText
				errors={errors.properties?.address?.properties?.street2?.errors}
			/>

			<Label htmlFor="address.city">City</Label>
			<Input id="address.city" name="address.city" placeholder="New York" />
			<ErrorText
				errors={errors.properties?.address?.properties?.city?.errors}
			/>

			<Label htmlFor="address.state">State</Label>
			<Input id="address.state" name="address.state" placeholder="NY" />
			<ErrorText
				errors={errors.properties?.address?.properties?.state?.errors}
			/>

			<Label htmlFor="address.zip">Zip</Label>
			<Input id="address.zip" name="address.zip" placeholder="52352" />
			<ErrorText errors={errors.properties?.address?.properties?.zip?.errors} />

			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? (
					<LoaderCircleIcon className="animate-spin" />
				) : (
					<PlusCircleIcon />
				)}
				Submit
			</Button>
		</form>
	);
};
