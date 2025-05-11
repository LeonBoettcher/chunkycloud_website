import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { fetchAPIkey, getAPIKey } from "../../../../actions/APIKey";

const handler = NextAuth({
  providers: [
    DiscordProvider({
      clientId:
        process.env.DISCORD_CLIENT_ID ??
        (() => {
          throw new Error("DISCORD_CLIENT_ID is not set");
        })(),
      clientSecret:
        process.env.DISCORD_CLIENT_SECRET ??
        (() => {
          throw new Error("DISCORD_CLIENT_SECRET is not set");
        })(),
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      try {
        if (typeof user.email === "string") {
          await fetchAPIkey(user.email);
        } else {
          throw new Error("User email is not a valid string");
        }
        return true;
      } catch (error) {
        console.error("Error fetching API key:", error);
        return true;
      }
    },
  },
});

export { handler as GET, handler as POST };
