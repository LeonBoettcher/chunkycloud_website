import type { UserJob } from "../../lib/api-client";

/**
 * Returns a JSX element representing the status of a job, based on its status string.
 * The status is displayed as a badge with different styles depending on the job's status.
 *
 * @param job - The UserJob object containing the job's status.
 * @returns A JSX element representing the job's status badge.
 *
 * 'draft' | 'queued' | 'running' | 'completed' | 'aborted';
 */

const getStatusTag = (job: UserJob) => {
  const status = job.status;

  if (!job.status)
    return <div className="badge badge-outline badge-error">unknown</div>;

  if (status.includes("draft"))
    return <div className="badge badge-outline badge-info">draft</div>;

  if (status.includes("queued"))
    return <div className="badge badge-outline badge-warning">queued</div>;

  if (status.includes("running"))
    return <div className="badge badge-outline badge-accent">running</div>;

  if (status.includes("completed"))
    return <div className="badge badge-outline badge-success">completed</div>;

  if (status.includes("aborted"))
    return <div className="badge badge-error badge-outline">aborted</div>;

  return <div className="badge badge-outline badge-primary">{job.status}</div>;
};

export default getStatusTag;
