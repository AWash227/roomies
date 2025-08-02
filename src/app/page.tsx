import Image from "next/image";
import { auth } from "./api/auth/[...nextauth]/auth";

export default async function Home() {
	const session = await auth();
	return (
		<div>{session ? <h1>Welcome Back {session?.user?.email}</h1> : null}</div>
	);
}
