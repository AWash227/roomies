import { redirect } from "next/navigation";
import { signIn, auth, providerMap } from "@/app/api/auth/[...nextauth]/auth";
import { AuthError } from "next-auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { SignInForm } from "@/components/sign-in-form";

export default async function SignInPage(props: {
	searchParams: Promise<{ callbackUrl: string | undefined }>;
}) {
	const { callbackUrl } = await props.searchParams;
	return (
		<div className="flex flex-col gap-2 max-w-2xl mx-auto mt-60">
			<Logo />
			<h1 className="text-2xl font-bold">Sign In</h1>
			<SignInForm callbackUrl={callbackUrl} />
			<Link href="/sign-up" className={buttonVariants({ variant: "link" })}>
				Don't have an account? Sign up for one!
			</Link>
		</div>
	);
}
