import { StudentCreateForm } from "@/components/forms/student-create-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircleIcon } from "lucide-react";

export default function Page() {
	return (
		<div>
			<div className="flex items-center justify-between p-2">
				<h1>Students</h1>
				<Dialog>
					<DialogTrigger asChild>
						<Button>
							<PlusCircleIcon /> Create
						</Button>
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Create Student</DialogTitle>
						</DialogHeader>
						<StudentCreateForm />
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
