"use client";
import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";

export const BuildingActions = (props: { id: string }) => {
	const { id } = props;
	const onEditClick = () => {};
	const onDeleteClick = () => {};

	return (
		<div className="space-x-2">
			<Button
				variant="secondary"
				size="icon"
				className="w-7 h-7"
				onClick={onEditClick}
			>
				<EditIcon />
			</Button>
			<Button
				variant="secondary"
				size="icon"
				className="w-7 h-7"
				onClick={onDeleteClick}
			>
				<TrashIcon />
			</Button>
		</div>
	);
};
