import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import { getUserByID } from "@/database/users";
import { env } from "@/env";
import { db } from "@/server/db";
import { GroupMembership } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      image: string;
      groups: GroupMembership[];
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    groups: GroupMembership[];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  callbacks: {
    signIn: async ({ user }) => {
      const existingUser = await getUserByID(user.id);

      if (existingUser && existingUser?.isBanned) return false;

      return true;
    },
    session: async ({ session, user }) => {
      const userWithGroups = await getUserByID(user.id);
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          groups: userWithGroups?.groups,
        },
      };
    },
  },
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    /**
     * ...add more providers here.
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
