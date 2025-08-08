import { auth, signIn } from "../api/auth/[...nextauth]/auth";

export default async function Home() {
	const session = await auth();
	if (!session) return signIn();
	return (
		<div>{session ? <h1>Welcome Back {session?.user?.email}</h1> : null}</div>
	);
}
