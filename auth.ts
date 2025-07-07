import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import prisma from '@/lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcrypt'

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Digite seu email" },
        password: { label: "Senha", type: "password", placeholder: "Digite sua senha" },
      },
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          throw new Error("Invalid credentials");
        }

        const { email, password } = parsedCredentials.data;

        const user = await prisma.user.findUnique({
          where: { email: email },
        });

        if (!user || !user.password) return null

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) return null;

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
})