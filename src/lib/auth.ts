/**
 * Authentication utilities and NextAuth v5 configuration
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "./prisma";

/**
 * NextAuth v5 configuration
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string,
          },
          include: {
            profile: true,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isPasswordValid = await compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name || null,
          careerTrack: user.profile?.careerTrack || null,
          isSuperAdmin: user.isSuperAdmin,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.careerTrack = (user as any).careerTrack;
        token.isSuperAdmin = (user as any).isSuperAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).careerTrack = token.careerTrack;
        (session.user as any).isSuperAdmin = token.isSuperAdmin;
      }
      return session;
    },
  },
});
