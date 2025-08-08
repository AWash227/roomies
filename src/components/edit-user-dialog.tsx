"use client";

import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { EditIcon, LoaderCircleIcon } from "lucide-react";
import { BuildingCreateForm } from "./forms/building-create-form";
import React from "react";
import { toast } from "sonner";
import { Building } from "@prisma/client";
import {
	CreateBuildingDto,
	EditBuildingDto,
} from "@/app/api/buildings/schemas";
import type { BuildingPayload } from "@/app/api/buildings/api";
import { BuildingEditForm } from "./forms/building-edit-form";
import { UserPayload } from "@/app/api/users/route";
import { updateUserSchema } from "@/app/api/users/schemas";
import z from "zod";
import { UserEditForm } from "./forms/user-edit-form";

export const EditUserDialog = (props: {
	id?: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { id, open, setOpen } = props;
	const [isLoading, setIsLoading] = React.useState(false);
	const [fetchedUser, setFetchedUser] = React.useState<UserPayload | null>(
		null,
	);

	// fetch
	React.useEffect(() => {
		if (!id) return;
		(async () => {
			setIsLoading(true);
			const res = await fetch(`/api/users/${id}`);
			const data = await res.json();
			switch (res.status) {
				case 200:
					setFetchedUser(data);
					break;
				default:
					toast.error(`Something went wrong fetching the user with id: ${id}`);
			}
			setIsLoading(false);
		})();
	}, [id]);

	// setup form w/ default values
	const defaultValues = React.useMemo(() => {
		if (!fetchedUser) return {};

		return {
			name: fetchedUser.name ?? "",
			email: fetchedUser.email ?? "",
			role: fetchedUser.role ?? "STUDENT",
		} satisfies z.infer<typeof updateUserSchema>;
	}, [fetchedUser]);

	if (!id) return null;
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update User</DialogTitle>
				</DialogHeader>
				{isLoading ? (
					<div className="flex items-center justify-center w-full h-full min-h-60">
						<LoaderCircleIcon className="animate-spin" />
					</div>
				) : (
					<UserEditForm id={id} defaultValues={defaultValues} />
				)}
			</DialogContent>
		</Dialog>
	);
};
