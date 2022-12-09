// import { initializeUserInDb } from "@lib/services/server/initializeUserInDb";
import { initializeUserInDb } from "@lib/services/server/initializeUserInDb";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      await initializeUserInDb(user);
      return true;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (account) {
        token.accessToken = account.access_token;
        token.uid = user?.uid;
        token.chat_id = user?.chat_id;
      }
      return token;
    },
    async session({ session, token, user }) {
      session.user.uid = token.uid as string;
      session.user.chat_id = token.chat_id as string;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET!,
  session: {
    strategy: "jwt",
  },
  theme: {
    colorScheme: "dark",
    brandColor: "#0000",
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  debug: true,
};
export default NextAuth(authOptions);
