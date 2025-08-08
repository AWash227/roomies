"use client";

import React, { FormEvent } from "react";
import { StudentFields } from "./fields/student";
import { Button } from "./ui/button";
import z from "zod";
import { createStudentSchema } from "@/app/api/students/schema";
import { Loader2Icon, PlusCircleIcon } from "lucide-react";
import { toast } from "sonner";

export const StudentCreateForm = () => {
	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [errors, setErrors] = React.useState<
		ReturnType<typeof z.treeifyError<z.infer<typeof createStudentSchema>>>
	>({ errors: [] });

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const form = e.currentTarget;
		const formData = new FormData(form);
		const data = Object.fromEntries(formData.entries());
		const parsed = createStudentSchema.safeParse(data);
		if (!parsed.success) {
			setErrors(z.treeifyError(parsed.error));
			return;
		}
		setErrors({ errors: [] });

		setIsSubmitting(true);
		const res = await fetch("/api/students", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(parsed.data),
		});
		setIsSubmitting(false);

		if (res.status === 201) {
			toast.success("The Student has been created successfully.");
		} else {
			toast.error("Something went wrong while creating the student.");
		}
	};

	return (
		<form onSubmit={onSubmit} className="space-y-2">
			<StudentFields errors={errors} />
			<Button disabled={isSubmitting}>
				{isSubmitting ? (
					<Loader2Icon className="animate-spin" />
				) : (
					<PlusCircleIcon />
				)}
				Submit
			</Button>
		</form>
	);
};
