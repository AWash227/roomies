import { BuildingCreateForm } from "@/components/building-create-form";
import { getBuildings } from "../api/buildings/api";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";
import React from "react";
import { InteractiveBuildingTable } from "@/components/building-interactive-table";

export default async function Page() {
	const buildings = await getBuildings();

	return (
		<>
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
			</div>
			<InteractiveBuildingTable buildings={buildings} />
		</>
	);
}
