import { auth } from "@/app/api/auth/[...nextauth]/auth";
import z from "zod";
import { UserDetailsForm } from "@/components/user-details-form";
import { db } from "@/lib/db";
import { ChangePasswordForm } from "@/components/change-password-form";
import { DeleteAccountForm } from "@/components/delete-account-form";
// name
// Email
// image

// The way that they are signed in perhaps
// sessions?

export default async function Page() {
	const session = await auth();
	if (!session?.user) return null;
	const user = await db.user.findUnique({ where: { id: session?.user.id } });

	return (
		<div>
			<h1 className="text-3xl max-w-4xl mx-auto p-2">Manage Your Account</h1>
			<div className="w-full h-full p-2 space-y-8 max-w-4xl mx-auto">
				<div className="space-y-2">
					<h2 className="font-bold text-muted-foreground text-sm">
						Account Details
					</h2>
					{session?.user?.id && (
						<UserDetailsForm
							id={session?.user?.id}
							defaultValues={{
								name: user?.name ?? "",
								email: user?.email ?? "",
							}}
						/>
					)}
				</div>

				<div className="space-y-2">
					<h2 className="font-bold text-muted-foreground text-sm">Security</h2>
					<ChangePasswordForm id={session?.user?.id} />
				</div>

				<div className="space-y-2">
					<h2 className="font-bold text-muted-foreground text-sm">
						Destructive Actions
					</h2>
					<div className="flex justify-between">
						<DeleteAccountForm id={session.user?.id} />
					</div>
				</div>
			</div>
		</div>
	);
}
