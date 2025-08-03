import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import z from "zod";
import { verify } from "argon2";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { logger } from "@/lib/utils";

export const signInSchema = z.object({
	email: z.email({ error: "Email is required" }).min(1, "Email is required"),
	password: z
		.string({ error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(256, "Password must be less than 256 characters"),
});

const adapter = PrismaAdapter(db);
export const {
	handlers: { GET, POST },
	auth,
} = NextAuth({
	debug: true,
	adapter,
	session: { strategy: "jwt" },
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		async session({ session, token }) {
			session.user.id = token.id as string;
			return session;
		},
	},
	providers: [
		Credentials({
			credentials: {
				email: {
					type: "email",
					label: "Email",
					placeholder: "johndoe@gmail.com",
				},
				password: {
					type: "password",
					label: "Password",
					placeholder: "*****",
				},
			},
			authorize: async (credentials) => {
				try {
					const { email, password } =
						await signInSchema.parseAsync(credentials);

					const user = await db.user.findFirst({ where: { email } });
					if (!user) throw new Error("Couldn't find user with email.");
					if (!user.passwordHash)
						throw new Error(
							"User doesn't have a password set up. Abort login.",
						);

					if (await verify(user.passwordHash, password)) {
						return {
							id: user.id,
							email: user.email,
							image: user.image,
							name: user.name,
						};
					}
					return null;
				} catch (e) {
					logger.error(e);
					return null;
				}
			},
		}),
	],
});
