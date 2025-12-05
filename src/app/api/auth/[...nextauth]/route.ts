import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { connectDB } from "@/libs/mongodb";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();
        const email = String(credentials.email).toLowerCase();

        // Because password field has select:false in schema, we need .select("+password")
        const user = await User.findOne({ email }).select("+password");
        if (!user) throw new Error("User does not exist");

        if (!user.password) throw new Error("Account created with OAuth. Use Google sign in.");

        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Password is incorrect");

        return { id: user._id.toString(), name: user.name, email: user.email };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id ?? token.sub;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).id = token.id;
      return session;
    },
  },
});

export { handler as GET, handler as POST };