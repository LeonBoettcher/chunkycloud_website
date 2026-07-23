"use client";

import React, { useState } from "react";
import { getJobFile } from "../../lib/api-client";
import type { Client } from "../../lib/api-client/client";

type DownloadableFile = "scene" | "octree" | "emittergrid";

interface DownloadModalProps {
  isOpen: boolean;
  jobId: number;
  client: Client;
  onClose: () => void;
}

const FILE_OPTIONS: { label: string; value: DownloadableFile }[] = [
  { label: "Scene", value: "scene" },
  { label: "Octree", value: "octree" },
  { label: "Emitter Grid", value: "emittergrid" },
  //{ label: "Dump", value: "dump" }, ADD LATER WHEN IMPLEMENTED
];

const DOWNLOAD_ERROR_MESSAGE = "File is not available yet.";

function getMessageFromPayload(payload: unknown): string | null {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "message" in payload &&
    typeof (payload as { message?: unknown }).message === "string"
  ) {
    return (payload as { message: string }).message;
  }

  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  return null;
}

function getFallbackFilename(
  jobId: number,
  fileType: DownloadableFile,
): string {
  const extensionByType: Record<DownloadableFile, string> = {
    scene: "scene",
    octree: "octree",
    emittergrid: "emittergrid",
  };
  return `job-${jobId}-${fileType}.${extensionByType[fileType]}`;
}

function getFilenameFromHeader(
  contentDisposition: string | null,
): string | null {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const fallbackMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return fallbackMatch?.[1] ?? null;
}

export default function DownloadModal({
  isOpen,
  jobId,
  client,
  onClose,
}: DownloadModalProps) {
  const [downloadingFile, setDownloadingFile] =
    useState<DownloadableFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  const triggerBrowserDownload = (downloadUrl: string, filename?: string) => {
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    if (filename) {
      anchor.download = filename;
    }
    anchor.rel = "noopener noreferrer";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  const handleDownload = async (file: DownloadableFile) => {
    if (downloadingFile) {
      return;
    }

    setDownloadingFile(file);
    setError(null);

    try {
      const result = await getJobFile({
        client,
        path: { id: jobId, file },
        parseAs: "stream",
        throwOnError: false,
      });

      if (result.error) {
        setError(getMessageFromPayload(result.error) ?? DOWNLOAD_ERROR_MESSAGE);
        return;
      }

      const response = result.response;
      if (!response) {
        setError(DOWNLOAD_ERROR_MESSAGE);
        return;
      }

      const contentType =
        response.headers.get("content-type")?.toLowerCase() ?? "";
      if (contentType.includes("application/json")) {
        const payload = (await response.json()) as unknown;
        setError(
          getMessageFromPayload(payload) ??
            "The server returned a message instead of a file.",
        );
        return;
      }

      const blob = await response.blob();
      if (!(blob instanceof Blob)) {
        setError("Unexpected download response.");
        return;
      }

      const headerFilename = getFilenameFromHeader(
        result.response?.headers.get("content-disposition") ?? null,
      );
      const filename = headerFilename ?? getFallbackFilename(jobId, file);

      const downloadUrl = URL.createObjectURL(blob);
      triggerBrowserDownload(downloadUrl, filename);
      URL.revokeObjectURL(downloadUrl);
      onClose();
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Download failed.",
      );
    } finally {
      setDownloadingFile(null);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-lg">
        <h3 className="text-xl font-semibold">Download Job File</h3>
        <p className="mt-2 text-sm opacity-80">Job ID: {jobId}</p>

        <div className="mt-5 space-y-3">
          <p className="font-medium">Choose file to download:</p>
          {FILE_OPTIONS.map((option) => {
            const isCurrent = downloadingFile === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className="btn btn-outline w-full justify-between"
                onClick={() => {
                  void handleDownload(option.value);
                }}
                disabled={downloadingFile !== null}
              >
                <span>{option.label}</span>
                <span className="inline-flex items-center gap-2">
                  {isCurrent ? "Downloading..." : "Download"}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M12 3a1 1 0 0 1 1 1v8.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42l2.3 2.3V4a1 1 0 0 1 1-1ZM5 18a1 1 0 0 1 1 1v1h12v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        {error && <p className="mt-4 text-sm text-error">{error}</p>}

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        aria-label="Close"
      >
        Close
      </button>
    </div>
  );
}
