"use client";

import React from "react";
import { BuildingTable, BuildingTableProps } from "./building-table";
import { EditBuildingDialog } from "./edit-building-dialog";
import { IdActionsProps } from "./building-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const InteractiveBuildingTable = (
	props: Pick<BuildingTableProps, "buildings">,
) => {
	const router = useRouter();
	const { buildings } = props;
	const [selectedId, setSelectedId] = React.useState<string | null>(null);
	const [open, setOpen] = React.useState(false);

	const onEditClick: IdActionsProps["onEditClick"] = (e, id) => {
		setSelectedId(id);
		setOpen(true);
	};

	const onDeleteClick: IdActionsProps["onDeleteClick"] = async (e, id) => {
		toast.warning("Are you sure you want to delete this building?", {
			action: {
				label: "Delete",
				onClick: async () => {
					const res = await fetch(`/api/buildings/${id}`, { method: "DELETE" });
					const data = await res.json();
					if (res.status === 200) {
						toast.success(`Successfully deleted ${data.name ?? "building"}`);
						router.refresh();
					} else {
						toast.error(`Failed to delete building`);
					}
				},
			},
		});
	};

	return (
		<>
			<BuildingTable
				buildings={buildings}
				onEditClick={onEditClick}
				onDeleteClick={onDeleteClick}
			/>
			<EditBuildingDialog
				id={selectedId ?? undefined}
				open={open}
				setOpen={setOpen}
			/>
		</>
	);
};
