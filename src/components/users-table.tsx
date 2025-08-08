import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { IdActions, type IdActionsProps } from "@/components/building-actions";
import type { BuildingPayload } from "@/app/api/buildings/api";
import { UserPayload } from "@/app/api/users/route";

export type UsersTableProps = {
	users: UserPayload[];
} & Partial<Omit<IdActionsProps, "id">>;
export const UsersTable = (props: UsersTableProps) => {
	const { users: buildings, onEditClick, onDeleteClick } = props;
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Role</TableHead>
					<TableHead>Email</TableHead>
					<TableHead>Actions</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{buildings.map((b) => (
					<TableRow key={b.id}>
						<TableCell>{b.name}</TableCell>
						<TableCell>{b.role}</TableCell>
						<TableCell>{b.email}</TableCell>
						<TableCell>
							{onEditClick && onDeleteClick && (
								<IdActions
									id={b.id}
									onEditClick={onEditClick}
									onDeleteClick={onDeleteClick}
								/>
							)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
