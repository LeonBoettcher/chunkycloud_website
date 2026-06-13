import { defineConfig } from "@hey-api/openapi-ts";
import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);
const apiUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://api.chunkycloud.lemaik.de";

export default defineConfig({
  input: `${apiUrl}/api-json`,
  output: "./lib/api-client",
  plugins: [
    {
      name: "@hey-api/client-next",
      throwOnError: true,
    },
    {
      name: "@hey-api/sdk",
      client: false,
    },
  ],
  parser: {
    filters: {
      tags: {
        exclude: ["DiscordAuth"],
      },
      operations: {
        // exclude methods that can only be used by render nodes
        exclude: ["getCurrentNode"],
      },
    },
  },
});
