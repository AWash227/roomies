"use client";
import React, { FormEvent } from "react";
import { Button } from "../ui/button";
import { unflatten } from "flat";
import { EditBuildingDto } from "@/app/api/buildings/schemas";
import z from "zod";
import { EditIcon, LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUserSchema, updateUserSchema } from "@/app/api/users/schemas";
import { UserFields } from "../fields/user";

export const UserEditForm = (props: {
	id: string;
	defaultValues?: EditBuildingDto;
}) => {
	const { id, defaultValues } = props;
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [errors, setErrors] = React.useState<
		ReturnType<typeof z.treeifyError<z.infer<typeof createUserSchema>>>
	>({ errors: [] });

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = unflatten(Object.fromEntries(formData.entries()));
		const parsed = updateUserSchema.safeParse(data);
		if (!parsed.success) {
			setErrors(z.treeifyError(parsed.error));
			return;
		}

		setIsSubmitting(true);
		const res = await fetch(`/api/users/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parsed.data),
		});
		setIsSubmitting(false);
		if (res.status === 200) {
			toast.success("Successfully edited user");
			form.reset();
			router.refresh();
		} else {
			toast.error("Failed to edit user");
		}
	};

	return (
		<form onSubmit={onSubmit} className="space-y-2">
			<UserFields defaultValues={defaultValues} errors={errors} />
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
