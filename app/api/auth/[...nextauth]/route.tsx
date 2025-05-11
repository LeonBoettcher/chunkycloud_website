import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

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
});

export { handler as GET, handler as POST };
