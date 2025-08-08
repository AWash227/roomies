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

export type BuildingTableProps = {
	buildings: BuildingPayload[];
} & Omit<IdActionsProps, "id">;
export const BuildingTable = (props: BuildingTableProps) => {
	const { buildings, onEditClick, onDeleteClick } = props;
	return (
		<Table>
			<TableHeader>
				<TableRow>
					<TableHead>Name</TableHead>
					<TableHead>Address</TableHead>
					<TableHead>Number of Floors</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{buildings.map((b) => (
					<TableRow key={b.id}>
						<TableCell>{b.name}</TableCell>
						<TableCell>
							{[
								[b.address?.street1, b.address?.street2]
									.filter(Boolean)
									.join(", "),
								b.address?.city,
								b.address?.state,
								b.address?.zip,
							]
								.filter(Boolean)
								.join(", ")}
						</TableCell>
						<TableCell>{b.numFloors.toLocaleString()}</TableCell>
						<TableCell>
							<IdActions
								id={b.id}
								onEditClick={onEditClick}
								onDeleteClick={onDeleteClick}
							/>
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
