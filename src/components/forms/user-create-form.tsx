"use client";
import React, { FormEvent } from "react";
import { Button } from "../ui/button";
import { unflatten } from "flat";
import {
	CreateBuildingDto,
	createBuildingSchema,
} from "@/app/api/buildings/schemas";
import z from "zod";
import { LoaderCircleIcon, PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { BuildingFields } from "../fields/building";
import { createUserSchema } from "@/app/api/users/schemas";
import { UserFields } from "../fields/user";
import { useRouter } from "next/navigation";

export const UserCreateForm = () => {
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
		const parsed = createUserSchema.safeParse(data);
		if (!parsed.success) {
			setErrors(z.treeifyError(parsed.error));
			return;
		}

		setIsSubmitting(true);
		const res = await fetch("/api/users", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parsed.data),
		});
		setIsSubmitting(false);
		if (res.status === 201) {
			toast.success("Successfully created user.");
			form.reset();
			router.refresh();
		} else {
			toast.error("Failed to create user.");
		}
	};

	return (
		<form onSubmit={onSubmit} className="space-y-2">
			<UserFields errors={errors} defaultValues={{ role: "STUDENT" }} />
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
