"use client";

import { LogInIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { FormEvent } from "react";
import { signInSchema } from "@/app/api/auth/schema";
import { useRouter } from "next/navigation";

export const SignInForm = (props: { callbackUrl?: string }) => {
	const { callbackUrl } = props;
	const router = useRouter();

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData(e.currentTarget);
		const data = Object.fromEntries(formData);
		const parsed = signInSchema.safeParse(data);
		if (!parsed.success) {
		}

		const url = new URL("/api/auth/sign-in", location.href);
		if (callbackUrl) url.searchParams.set("callbackUrl", callbackUrl);

		const res = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(parsed.data),
		});

		if (res.redirected) {
			window.location.assign(res.url);
		}
	};

	return (
		<form className="flex flex-col space-y-2" onSubmit={onSubmit}>
			<Label htmlFor="email">Email</Label>
			<Input name="email" id="email" placeholder="john@acme.com" />
			<Label htmlFor="password">Password</Label>
			<Input
				name="password"
				id="password"
				placeholder="*********"
				type="password"
			/>
			<Button type="submit">
				<LogInIcon /> Sign In
			</Button>
		</form>
	);
};
