"use client";
import React, { FormEvent } from "react";
import { Button } from "./ui/button";
import { unflatten } from "flat";
import {
	CreateBuildingDto,
	EditBuildingDto,
	editBuildingSchema,
} from "@/app/api/buildings/schemas";
import z from "zod";
import { EditIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { BuildingFields } from "./fields/building";
import { useRouter } from "next/navigation";

export const BuildingEditForm = (props: {
	id: string;
	defaultValues?: EditBuildingDto;
}) => {
	const { id, defaultValues } = props;
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [errors, setErrors] = React.useState<
		ReturnType<typeof z.treeifyError<CreateBuildingDto>>
	>({ errors: [] });

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = unflatten(Object.fromEntries(formData.entries()));
		const parsed = editBuildingSchema.safeParse(data);
		if (!parsed.success) {
			setErrors(z.treeifyError(parsed.error));
			return;
		}

		setIsSubmitting(true);
		const res = await fetch(`/api/buildings/${id}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parsed.data),
		});
		setIsSubmitting(false);
		if (res.status === 200) {
			toast.success("Successfully edited building.");
			form.reset();
			router.refresh();
		} else {
			toast.error("Failed to edit building.");
		}

		console.log(data);
	};

	return (
		<form onSubmit={onSubmit} className="space-y-2">
			<BuildingFields defaultValues={defaultValues} errors={errors} />
			<Button type="submit" disabled={isSubmitting} className="w-full">
				{isSubmitting ? (
					<LoaderCircleIcon className="animate-spin" />
				) : (
					<EditIcon />
				)}
				Submit
			</Button>
		</form>
	);
};
