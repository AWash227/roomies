"use client";
import { TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import { FormEvent } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const DeleteAccountForm = (props: { id?: string }) => {
	const router = useRouter();
	const { id } = props;
	if (!id) return null;

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		toast("Are you sure you want to delete your account?", {
			action: {
				label: "Confirm",
				onClick: async () => {
					const res = await fetch(`/api/users/${id}`, {
						method: "DELETE",
					});
					if (res.status === 200) {
						router.push("/api/auth/signin");
					}
				},
			},
		});
	};

	return (
		<form onSubmit={onSubmit} className="flex justify-between w-full">
			<div>
				<p className="text-destructive text-sm font-semibold">
					Delete your account
				</p>
				<p className="text-muted-foreground text-xs">
					Permanently delete your account.
				</p>
			</div>
			<Button variant="destructive" size="sm">
				<TrashIcon />
				Delete Account
			</Button>
		</form>
	);
};
