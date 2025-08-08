"use client";
import React, { FormEvent } from "react";
import { Button } from "./ui/button";
import { unflatten } from "flat";
import {
	CreateBuildingDto,
	createBuildingSchema,
} from "@/app/api/buildings/schemas";
import z from "zod";
import { LoaderCircleIcon, PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { BuildingFields } from "./fields/building";

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
	};

	return (
		<form onSubmit={onSubmit} className="space-y-2">
			<BuildingFields errors={errors} />
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
