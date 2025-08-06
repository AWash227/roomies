"use client";

import React from "react";
import { BuildingTable, BuildingTableProps } from "./building-table";
import { EditBuildingDialog } from "./edit-building-dialog";
import { BuildingActionsProps } from "./building-actions";

export const InteractiveBuildingTable = (
	props: Pick<BuildingTableProps, "buildings">,
) => {
	const { buildings } = props;
	const [selectedId, setSelectedId] = React.useState<string | null>(null);
	const [open, setOpen] = React.useState(false);

	const onEditClick: BuildingActionsProps["onEditClick"] = (e, id) => {
		setSelectedId(id);
		setOpen(true);
	};
	return (
		<>
			<BuildingTable
				buildings={buildings}
				onEditClick={onEditClick}
				onDeleteClick={() => {}}
			/>
			<EditBuildingDialog
				id={selectedId ?? undefined}
				open={open}
				setOpen={setOpen}
			/>
		</>
	);
};
