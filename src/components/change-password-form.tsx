"use client";

import { LoaderCircleIcon, RotateCcwKeyIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import z from "zod";
import React, { FormEvent } from "react";
import { changePasswordSchema } from "@/app/api/users/[id]/change-password/schema";
import { toast } from "sonner";
import { ErrorText } from "./error-text";

export const ChangePasswordForm = (props: { id?: string }) => {
	const { id } = props;
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [errors, setErrors] = React.useState<
		ReturnType<typeof z.treeifyError<z.infer<typeof changePasswordSchema>>>
	>({ errors: [] });

	if (!id) return null;

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		const parsed = await changePasswordSchema.safeParseAsync(data);

		if (parsed.success) {
			setIsSubmitting(true);
			const res = await fetch(`/api/users/${id}/change-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(parsed.data),
			});
			setIsSubmitting(false);
			if (res.status === 200) {
				setErrors({ errors: [] });
				toast.success("Your password has been changed successfully.");
				// reset form data
				form.reset();
			} else {
				toast.error("Something went wrong when changing your password.", {});
			}
		} else {
			setErrors(z.treeifyError(parsed.error));
		}
	};

	return (
		<form className="space-y-2" onSubmit={onSubmit}>
			<Input
				name="currentPassword"
				placeholder="Current Password"
				type="password"
			/>
			<ErrorText errors={errors.properties?.currentPassword?.errors} />

			<Input name="password" placeholder="New Password" type="password" />
			<ErrorText errors={errors.properties?.password?.errors} />

			<Input
				name="passwordConfirm"
				placeholder="Confirm New Password"
				type="password"
			/>
			<ErrorText errors={errors.properties?.passwordConfirm?.errors} />

			<Button size="sm" disabled={isSubmitting}>
				{isSubmitting ? (
					<LoaderCircleIcon className="animate-spin" />
				) : (
					<RotateCcwKeyIcon />
				)}{" "}
				Change Password
			</Button>
		</form>
	);
};
