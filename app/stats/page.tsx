import Stats from "./Stats";

export default async function StatsPage() {
  const res = await fetch("http://localhost:3213/api/stats", {
    cache: "no-store",
  });

  const data = await res.json();

  return <Stats initialStats={data} />;
}
