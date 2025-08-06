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
import { BuildingCreateForm } from "./building-create-form";
import React from "react";
import { toast } from "sonner";
import { Building } from "@prisma/client";
import {
	CreateBuildingDto,
	EditBuildingDto,
} from "@/app/api/buildings/schemas";
import type { BuildingPayload } from "@/app/api/buildings/api";
import { BuildingEditForm } from "./building-edit-form";

export const EditBuildingDialog = (props: {
	id?: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	const { id, open, setOpen } = props;
	const [isLoading, setIsLoading] = React.useState(false);
	const [fetchedBuilding, setFetchedBuilding] =
		React.useState<BuildingPayload | null>(null);

	// fetch
	React.useEffect(() => {
		if (!id) return;
		(async () => {
			setIsLoading(true);
			const res = await fetch(`/api/buildings/${id}`);
			const data = await res.json();
			switch (res.status) {
				case 200:
					setFetchedBuilding(data);
					break;
				default:
					toast.error(
						`Something went wrong fetching the building with id: ${id}`,
					);
			}
			setIsLoading(false);
		})();
	}, [id]);

	// setup form w/ default values
	const defaultValues = React.useMemo(() => {
		if (!fetchedBuilding || !fetchedBuilding.address) return {};

		return {
			name: fetchedBuilding.name ?? undefined,
			numFloors: fetchedBuilding.numFloors,
			address: {
				street1: fetchedBuilding.address?.street1,
				street2: fetchedBuilding.address?.street2,
				city: fetchedBuilding.address?.city,
				state: fetchedBuilding.address?.state,
				zip: fetchedBuilding.address?.zip,
			},
		} satisfies EditBuildingDto;
	}, [fetchedBuilding]);

	if (!id) return null;
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Update Building</DialogTitle>
				</DialogHeader>
				{isLoading ? (
					<div className="flex items-center justify-center w-full h-full min-h-60">
						<LoaderCircleIcon className="animate-spin" />
					</div>
				) : (
					<BuildingEditForm id={id} defaultValues={defaultValues} />
				)}
			</DialogContent>
		</Dialog>
	);
};
