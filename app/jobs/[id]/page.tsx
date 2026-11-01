import type { Metadata } from "next";
import { cache } from "react";
import { getJob } from "../../../lib/api-client";
import { publicApiClient } from "../../../lib/publicApiClient";
import JobDetails from "./JobDetails";

type PageProps = {
  params: Promise<{ id: string }>;
};

// Share the anonymous lookup between the page and metadata within this request.
// Never use session credentials here: private jobs must stay in the client flow.
const getPublicJob = cache(async (id: number) => {
  const result = await getJob({
    client: publicApiClient,
    path: { id },
    cache: "no-store",
    throwOnError: false,
  });

  if (result.response?.status !== 200 || !result.data) {
    return null;
  }

  return { job: result.data };
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const publicJob = await getPublicJob(Number(id));
  if (!publicJob) {
    return {};
  }

  const { job } = publicJob;
  const description = `${job.width}×${job.height} render by ${job.createdBy.displayName} on ChunkyCloud, ${job.spp} samples per pixel.`;
  const imageUrl = job.thumbnailUrl;
  const images = imageUrl
    ? [{ url: imageUrl, alt: `Thumbnail for job ${job.id}` }]
    : [];

  return {
    title: `Job ${job.id} | ChunkyCloud`,
    description,
    openGraph: {
      type: "website",
      siteName: "ChunkyCloud",
      url: `https://chunkycloud.net/jobs/${job.id}`,
      title: `Job ${job.id}`,
      description,
      images,
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: `Job ${job.id} | ChunkyCloud`,
      description,
      images,
      creator: job.createdBy.displayName,
    },
  };
}

export default async function JobPage({ params }: PageProps) {
  const { id } = await params;
  const publicJob = await getPublicJob(Number(id));

  return (
    <JobDetails
      key={id}
      id={Number(id)}
      initialRenderedAt={Date.now()}
      initialJob={publicJob?.job ?? null}
      initialResultImageUrl={publicJob?.job.thumbnailUrl ?? null}
    />
  );
}
