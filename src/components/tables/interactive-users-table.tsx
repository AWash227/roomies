"use client";

import React from "react";
import { IdActionsProps } from "../building-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UsersTable, UsersTableProps } from "../users-table";
import { EditUserDialog } from "../edit-user-dialog";

export const InteractiveUsersTable = (
	props: Pick<UsersTableProps, "users">,
) => {
	const router = useRouter();
	const { users } = props;
	const [selectedId, setSelectedId] = React.useState<string | null>(null);
	const [open, setOpen] = React.useState(false);

	const onEditClick: IdActionsProps["onEditClick"] = (e, id) => {
		setSelectedId(id);
		setOpen(true);
	};

	const onDeleteClick: IdActionsProps["onDeleteClick"] = async (e, id) => {
		toast.warning("Are you sure you want to delete this user?", {
			action: {
				label: "Delete",
				onClick: async () => {
					const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
					const data = await res.json();
					if (res.status === 200) {
						toast.success(`Successfully deleted ${data.name ?? "user"}`);
						router.refresh();
					} else {
						toast.error(`Failed to delete user`);
					}
				},
			},
		});
	};

	return (
		<>
			<UsersTable
				users={users}
				onEditClick={onEditClick}
				onDeleteClick={onDeleteClick}
			/>

			<EditUserDialog
				id={selectedId ?? undefined}
				open={open}
				setOpen={setOpen}
			/>
		</>
	);
};
