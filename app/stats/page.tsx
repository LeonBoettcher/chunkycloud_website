import Stats from "./Stats";
import { getPublicStats } from "../../lib/api-client";
import { publicApiClient } from "../../lib/publicApiClient";

export default async function StatsPage() {
  const { data } = await getPublicStats({
    client: publicApiClient,
    throwOnError: false,
  });

  return <Stats initialStats={data} />;
}
