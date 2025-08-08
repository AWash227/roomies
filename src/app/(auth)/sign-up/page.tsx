import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { SignUpForm } from "@/components/sign-up-form";
import { Logo } from "@/components/logo";

export default async function Page(props: {
	searchParams: { callbackUrl: string | undefined };
}) {
	return (
		<div className="flex flex-col gap-2 max-w-2xl mx-auto mt-60">
			<Logo />
			<h1 className="text-2xl font-bold">Sign Up</h1>
			<SignUpForm />
			<Link href="/sign-in" className={buttonVariants({ variant: "link" })}>
				Already have an account? Sign in!
			</Link>
		</div>
	);
}
