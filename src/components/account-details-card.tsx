import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { EditIcon, ImagePlusIcon, RotateCcwKeyIcon } from "lucide-react";
import { User } from "next-auth";
import Image from "next/image";

export const AccountDetailsCard = (props: { user?: User }) => {
	const { user } = props;

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Account Details</CardTitle>
				<CardDescription>
					View and modify your account details below
				</CardDescription>
				<CardAction>
					<Button variant="secondary" size="sm" className="w-full">
						<EditIcon className="w-4 h-4" />
						Edit Details
					</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="flex flex-row space-x-4">
					{user?.image ? (
						<Image
							alt="Account Image"
							src={user.image}
							width={75}
							height={75}
						/>
					) : (
						<div className="w-[75] h-[75] flex items-center justify-center border rounded">
							<ImagePlusIcon className="w-8 h-8" />
						</div>
					)}
					<div className="space-y-2">
						<p>
							<span className="font-bold mr-2">Name </span>
							{user?.name ? (
								<span className="text-sm">{user?.name}</span>
							) : (
								<span className="text-muted-foreground text-sm">
									No Name Specified
								</span>
							)}
						</p>
						<p>
							<span className="font-bold mr-2">Email </span>
							{user ? (
								<span className="text-sm">{user?.email}</span>
							) : (
								<span className="text-muted-foreground text-sm">
									No Email Specified
								</span>
							)}
						</p>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button variant="link" size="sm" className="mt-4 w-full text-xs">
					<RotateCcwKeyIcon className="w-4 h-4" />
					Change Password
				</Button>
			</CardFooter>
		</Card>
	);
};
