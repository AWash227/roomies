"use client";

import { UserPlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import React, { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/app/api/auth/schema";
import z from "zod";
import { ErrorText } from "./error-text";

export const SignUpForm = () => {
	const [emailTaken, setEmailTaken] = React.useState(false);
	const [errors, setErrors] = React.useState<
		ReturnType<typeof z.treeifyError<z.infer<typeof signUpSchema>>>
	>({ errors: [] });

	const router = useRouter();
	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setEmailTaken(false);

		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData);

		const parsed = signUpSchema.safeParse(data);
		if (!parsed.success) {
			setErrors(z.treeifyError(parsed.error));
			return;
		}
		setErrors({ errors: [] });

		const res = await fetch("/api/auth/sign-up", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(parsed.data),
		});

		if (res.status === 409) {
			setEmailTaken(true);
		}

		if (res.status === 200) {
			router.push("/sign-in");
		}
	};

	return (
		<form className="flex flex-col space-y-2" onSubmit={onSubmit}>
			<Label htmlFor="email">Email</Label>
			<Input id="email" type="text" name="email" placeholder="john@acme.com" />
			<ErrorText
				errors={[
					...(errors.properties?.email?.errors ?? []),
					...(emailTaken ? ["Email is Already Taken"] : []),
				]}
			/>
			<Label htmlFor="password">Password</Label>
			<Input
				id="password"
				type="password"
				name="password"
				placeholder="**************"
			/>
			<ErrorText errors={errors.properties?.password?.errors} />
			<Button type="submit">
				<UserPlusIcon /> Sign Up
			</Button>
		</form>
	);
};
