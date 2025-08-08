import { buttonVariants } from "@/components/ui/button";
import { ShieldXIcon } from "lucide-react";
import Link from "next/link";

export default function Page() {
	return (
		<div className="w-full h-full flex flex-col items-center justify-center space-y-4">
			<ShieldXIcon className="w-8 h-8" />
			<p>Something went wrong while signing you in.</p>
			<Link href="/sign-in" className={buttonVariants({ variant: "default" })}>
				Try again
			</Link>
		</div>
	);
}
