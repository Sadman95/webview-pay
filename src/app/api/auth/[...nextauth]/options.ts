import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			httpOptions: {
				headers: {
					Authorization: `Bearer ${process.env.NEXTAUTH_SECRET}`,
				},
			},
		}),
		GithubProvider({
			clientId: process.env.GITHUB_CLIENT_ID as string,
			clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
			httpOptions: {
				headers: {
					Authorization: `Bearer ${process.env.NEXTAUTH_SECRET}`,
				},
			},
		}),
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID as string,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
			httpOptions: {
				headers: {
					Authorization: `Bearer ${process.env.NEXTAUTH_SECRET}`,
				},
			},
		}),
		// CredentialsProvider({
		// 	name: "Credentials",
		// 	credentials: {
		// 		email: { label: "Email", type: "text", placeholder: "Email" },
		// 		password: {
		// 			label: "Password",
		// 			type: "password",
		// 			placeholder: "Password",
		// 		},
		// 		username: { label: "Username", type: "text", placeholder: "Username" },
		// 	},
		// 	async authorize(credentials) {
		// 		// Add logic here to look up the user from the credentials supplied
		// 		const result = await findUserByProp(
		// 			"email",
		// 			credentials?.email as string
		// 		);
		// 		if (result) {
		// 			console.log("user: ", result);

		// 			return result;
		// 		} else {
		// 			return null;
		// 		}
		// 	},
		// }),
	],
};
