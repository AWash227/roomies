import { BuildingCreateForm } from "@/components/building-create-form";
import { getBuildings } from "../api/buildings/api";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { BuildingActions } from "@/components/building-actions";

export default async function Page() {
	const buildings = await getBuildings();

	return (
		<div className="flex flex-col">
			<div className="flex flex-row justify-between p-2 sticky top-0 z-10 bg-background items-center">
				<h1>Buildings</h1>
				<Dialog>
					<DialogTrigger asChild>
						<Button size="sm">
							<PlusCircleIcon /> Create Building
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Building</DialogTitle>
						</DialogHeader>
						<BuildingCreateForm />
					</DialogContent>
				</Dialog>
			</div>
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
								<BuildingActions id={b.id} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
