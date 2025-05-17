import React from "react";

interface SortVariables {
  SortOrder: string;
  SortByUser: string;
  SortByStatus: string;
}

const JobCards = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`, {
    cache: "no-store",
  });

  const data = await res.json();
  const jobs = Object.entries(data); // [ ['123', {...}], ['124', {...}] ]

  return (
    <>
      {jobs.map(([id, job]: [string, any]) => (
        <div
          key={id}
          className="card flex w-full bg-gray-800 text-white shadow-lg"
        >
          <div className="card-body">
            <h2 className="card-title">{id}</h2>
            <p>
              SPP: {job.targetSpp} / {job.spp}
            </p>
            <p>Status: {job.status ?? "Unbekannt"}</p>
            <p>Created: {new Date(job.created).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default JobCards;

/*{
  SortOrder,
  SortByUser,
  SortByStatus,
}: SortVariables
*/
