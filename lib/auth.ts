import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcrypt";
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Missing email or password");
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });
          if (!user) {
            throw new Error("Invalid email or password");
            // return null
          }

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            throw new Error("Invalid password");
            // return null
          }

          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          console.log("Error in next auth", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT CALLBACK");
      console.log("USER:", user);
      console.log("TOKEN BEFORE:", token);
      if (user) {
        token.id = user.id;
      }
      console.log("TOKEN AFTER:", token);
      return token;
    },
    async session({ session, token }) {
      console.log("SESSION CALLBACK");
      console.log("SESSION BEFORE:", session);
      console.log("TOKEN:", token);
      if (session.user) {
        session.user.id = token.id as string;
      }
      console.log("SESSION AFTER:", session);
      return session;
    },
  },
  pages: {
    signIn: "/signin",
    error: "/",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXT_AUTH_SECRET,
};
