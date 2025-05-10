import Stats from "./Stats";

export default async function StatsPage() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/stats`, {
    cache: "no-store",
  });

  const data = await res.json();

  return <Stats initialStats={data} />;
}
