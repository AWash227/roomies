"use client";
import { EditIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";

export type IdActionsProps = {
	id?: string;
	onEditClick: (
		e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
		id: string,
	) => void;
	onDeleteClick: (
		e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>,
		id: string,
	) => void;
};

export const IdActions = (props: IdActionsProps) => {
	const { id, onEditClick, onDeleteClick } = props;

	return (
		<div className="space-x-2">
			<Button
				variant="secondary"
				size="icon"
				className="w-7 h-7"
				onClick={id ? (e) => onEditClick(e, id) : undefined}
			>
				<EditIcon />
			</Button>
			<Button
				variant="secondary"
				size="icon"
				className="w-7 h-7"
				onClick={id ? (e) => onDeleteClick(e, id) : undefined}
			>
				<TrashIcon />
			</Button>
		</div>
	);
};
