import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

function useJob(id, initialData) {
  const [job, setJob] = useState(initialData);
  useEffect(() => {
    let stale = false;
    async function loadJob() {
      const res = await fetch(`https://api.chunkycloud.lemaik.de/jobs/${id}`);
      if (res.status === 200) {
        const json = await res.json();
        if (!stale) {
          setJob(json);
        }
      } else {
        setJob(null);
      }
    }
    let interval;
    if (id) {
      interval = setInterval(() => loadJob(), 30000);
    }
    return () => {
      stale = true;
      setJob(null);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [id]);
  return job;
}

export async function getServerSideProps(context) {
  const res = await fetch(
    `https://api.chunkycloud.lemaik.de/jobs/${context.params.id}`
  );
  const data = await res.json();

  return {
    props: {
      initialData: data,
    },
  };
}

export default function JobDetails({ initialData }) {
  const router = useRouter();
  const { id } = router.query;

  const job = useJob(id, initialData);

  return (
    <div>
      <Head>
        <title>Job {id} – ChunkyCloud</title>
      </Head>
      <a
        href={`https://api.chunkycloud.lemaik.de/jobs/${id}/latest.png`}
        target="_blank"
        rel="noreferrer"
      >
        <img
          src={`https://api.chunkycloud.lemaik.de/jobs/${id}/latest.png`}
          alt="Not available yet"
          width="500"
        />
      </a>
      {job && (
        <table>
          <tbody>
            <tr>
              <th>Resolution</th>
              <td>
                {job.sceneDescription?.width} × {job.sceneDescription?.height}
              </td>
            </tr>
            <tr>
              <th>Ray depth</th>
              <td>{job.sceneDescription?.rayDepth}</td>
            </tr>
            <tr>
              <th>
                <abbr title="Samples per pixel">SPP</abbr>
              </th>
              <td>
                {job.spp.toLocaleString()}/{job.targetSpp.toLocaleString()} (
                {Math.round((job.spp / job.targetSpp) * 100)}%)
                {job.spp > 0 && (
                  <>
                    {" "}
                    <a
                      href={`https://api.chunkycloud.lemaik.de/jobs/${id}/latest.dump`}
                      target="_blank"
                      rel="noreferrer"
                      download
                    >
                      Download dump
                    </a>
                  </>
                )}
              </td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{new Date(job.created).toLocaleString()}</td>
            </tr>
            <tr>
              <th>Finished at</th>
              <td>
                {job.finishedAt
                  ? new Date(job.finishedAt).toLocaleString()
                  : job.cancelled
                  ? "Cancelled"
                  : "n/a"}
              </td>
            </tr>
            {!job.cancelled && (
              <>
                <tr>
                  <th>
                    Render time<sup>(1)</sup>
                  </th>
                  <td>
                    <Duration start={job.created} end={job.finishedAt} />
                  </td>
                </tr>
                <tr>
                  <th>
                    Effective <abbr title="Samples per second">SPS</abbr>
                    <sup>(2)</sup>
                  </th>
                  <td>
                    {(
                      (job.targetSpp *
                        job.sceneDescription?.width *
                        job.sceneDescription?.height) /
                      ((Date.parse(job.finishedAt || new Date().toISOString()) -
                        Date.parse(job.created)) /
                        1000)
                    ).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      )}
      <p>
        <sup>1</sup>Includes time spent waiting for workers and transmitting
        files
        <br />
        <sup>2</sup>Total samples divided by the render time
      </p>
    </div>
  );
}

function Duration({ start, end }) {
  const [actualEnd, setActualEnd] = useState(end || new Date());
  useEffect(() => {
    if (end) {
      setActualEnd(end);
    } else {
      const interval = setInterval(() => {
        setActualEnd(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [end]);

  const delta = Math.max(0, Date.parse(actualEnd) - Date.parse(start)) / 1000;
  const h = Math.floor(delta / (60 * 60));
  const m = Math.floor((delta % (60 * 60)) / 60);
  const s = Math.floor(delta % 60);
  return `${`${h}`.padStart(2, "0")}:${`${m}`.padStart(
    2,
    "0"
  )}:${`${s}`.padStart(2, "0")}`;
}