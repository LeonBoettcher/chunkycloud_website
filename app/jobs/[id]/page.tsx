"use client";

import React from "react";

const JobPage = () => {
  // mock data for layout preview only
  const job = {
    id: "demo-job",
    spp: 1200,
    targetSpp: 5000,
    pictureOnly: false,
    created: new Date().toISOString(),
    finishedAt: null,
    cancelled: false,
    renderTime: 0,
    sceneDescription: {
      width: 1920,
      height: 1080,
      rayDepth: 8,
    },
  };

  return (
    <div>
      {/* Image preview placeholder */}
      {job.spp > 0 && (
        <div>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <img
              src="/images/blueprint.png"
              alt="Preview"
              width="500"
            />
          </a>
        </div>
      )}

      <table>
        <tbody>
          <tr>
            <th>Resolution</th>
            <td>
              {job.sceneDescription.width} × {job.sceneDescription.height}
            </td>
          </tr>

          <tr>
            <th>Ray depth</th>
            <td>{job.sceneDescription.rayDepth}</td>
          </tr>

          <tr>
            <th>
              <abbr title="Samples per pixel">SPP</abbr>
            </th>
            <td>
              {job.spp.toLocaleString()}/{job.targetSpp.toLocaleString()} (
              {Math.round((job.spp / job.targetSpp) * 100)}%)
            </td>
          </tr>

          <tr>
            <th>Created at</th>
            <td>{new Date(job.created).toLocaleString()}</td>
          </tr>

          <tr>
            <th>Finished at</th>
            <td>n/a</td>
          </tr>

          <tr>
            <th>
              Total time<sup>(1)</sup>
            </th>
            <td>--:--:--</td>
          </tr>

          <tr>
            <th>
              Effective <abbr title="Samples per second">SPS</abbr>
              <sup>(2)</sup>
            </th>
            <td>n/a</td>
          </tr>

          <tr>
            <th>
              Render time<sup>(3)</sup>
            </th>
            <td>--:--:--</td>
          </tr>

          <tr>
            <th>
              Average <abbr title="Samples per second">SPS</abbr>
              <sup>(4)</sup>
            </th>
            <td>n/a</td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: "0.8rem" }}>
        <sup>1</sup> Actual time between job creation and completion.
        <br />
        <sup>2</sup> Total samples divided by total time.
        <br />
        <sup>3</sup> Sum of render times of all dumps.
        <br />
        <sup>4</sup> Total samples divided by render time.
      </p>
    </div>
  );
};

export default JobPage;