import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/user";
import dbConnect from "@/libs/mongodb";
import { compare } from "bcryptjs";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},

      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials?.email }).select("+password");

        if (!user) {
          throw new Error("User does not exist");
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error("Password is incorrect");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },

    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
});

export { handler as GET, handler as POST };
