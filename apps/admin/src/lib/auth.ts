import db from "@platter/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendVerificationEmailAction } from "./actions/email";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      hasCompletedOnboarding: {
        type: "boolean",
        defaultValue: false,
      },
    },
  },
  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await sendVerificationEmailAction({
        email: user.email,
        url: url,
      });
    },
  },
  plugins: [nextCookies()],
});
