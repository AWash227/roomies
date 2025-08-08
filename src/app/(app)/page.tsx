import { Logo } from "@/components/logo";
import { auth, signIn } from "../api/auth/[...nextauth]/auth";

export default async function Home() {
	const session = await auth();
	if (!session) return signIn();
	return (
		<div className="flex justify-center items-center w-full h-full flex-col">
			<Logo />
			{session ? <h1>Welcome Back {session?.user?.email}</h1> : null}
		</div>
	);
}
