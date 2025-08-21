import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined
      ): Promise<{ id: string; email: string } | null> {
        if (!credentials || !credentials.email || !credentials.password) return null;

        const adminUsers = (process.env.NEXT_PUBLIC_ADMIN_USERS || "").split(",");
        const fixedPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "yourFixedPassword";

        if (adminUsers.includes(credentials.email) && credentials.password === fixedPassword) {
          return { id: credentials.email, email: credentials.email };
        }

        return null;
      },
    }),
  ],
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  jwt: { secret: process.env.NEXTAUTH_SECRET },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id && token?.email) {
        session.user = { id: token.id, email: token.email };
      }
      return session;
    },
  },
};

// Create NextAuth handler
const handler = NextAuth(authOptions);

// App Router requires exporting GET and POST handlers
export { handler as GET, handler as POST };
