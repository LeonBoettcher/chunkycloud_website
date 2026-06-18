"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import Header from "../../components/Header";
import { Fieldset } from "@headlessui/react";

import { useSession } from "../../app/auth/components/SessionProvider";
import { createJob } from "../../lib/api-client";

//TODO: Add a check for Scene Description description octree to test if the file structure is correct before sending to api

function createFileList(...files: File[]): FileList {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
}

export default function CreateJob() {
  const { isLoggedIn, logout, client } = useSession();

  const router = useRouter();

  const [sceneDescription, setSceneDescription] = useState<File>();
  const [octree, setOctree] = useState<File>();
  const [emitterGrid, setEmitterGrid] = useState<File>();
  const [emitterGridRequired, setEmitterGridRequired] = useState(false);
  const [targetSpp, setTargetSpp] = useState(500);
  const [renderDump, setRenderDump] = useState(false);
  const [texturepack, setTexturepack] = useState<string>("");
  const [skymap, setSkymap] = useState<File>();
  const [skymapRequired, setSkymapRequired] = useState(false);
  const [folderDropSupported, setFolderDropSupported] = useState(false);

  const [resourcePacks, setResourcePacks] = useState<
    { name: string; displayName: string }[]
  >([]);

  useEffect(() => {
    // fetch available resource packs for the texturepack select
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/resourcepacks`,
        );
        if (res.ok) {
          const data = await res.json();
          setResourcePacks(data || []);
        }
      } catch (e) {
        console.error("Could not load resource packs", e);
      }
    })();

    setFolderDropSupported(
      typeof window !== "undefined" &&
        typeof DataTransferItem !== "undefined" &&
        !!DataTransferItem.prototype.webkitGetAsEntry &&
        typeof DataTransfer === "function",
    );
  }, []);

  const sceneDescriptionRef = useRef<HTMLInputElement>(null);
  const octreeRef = useRef<HTMLInputElement>(null);
  const emitterGridRef = useRef<HTMLInputElement>(null);
  const skymapRef = useRef<HTMLInputElement>(null);

  const handleSceneDescriptionFileChange = useCallback(
    async (file: File | undefined) => {
      if (file?.type === "application/json") {
        setSceneDescription(file);
        const json = JSON.parse(await file.text());
        const newEmitterGridRequired =
          json.emitterSamplingStrategy &&
          json.emitterSamplingStrategy !== "NONE";
        setEmitterGridRequired(newEmitterGridRequired);
        if (!newEmitterGridRequired && emitterGridRef.current) {
          emitterGridRef.current.value = "";
        }

        const newSkymapRequired =
          json.sky?.mode === "SKYMAP_PANORAMIC" ||
          json.sky?.mode === "SKYMAP_SPHERICAL";
        setSkymapRequired(newSkymapRequired);
        if (!newSkymapRequired && skymapRef.current) {
          skymapRef.current.value = "";
        }
      } else {
        setEmitterGridRequired(false);
        setSkymapRequired(false);
        if (emitterGridRef.current) emitterGridRef.current.value = "";
        if (skymapRef.current) skymapRef.current.value = "";
      }
    },
    [],
  );

  const handleSceneDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSceneDescriptionFileChange(e.target.files?.[0]);
    },
    [handleSceneDescriptionFileChange],
  );

  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!sceneDescription || !octree) {
      setShowValidation(true);
      return;
    }

    setShowValidation(false);
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("scene", sceneDescription);
      body.append("octree", octree);
      if (emitterGridRequired && emitterGrid)
        body.append("emittergrid", emitterGrid);
      body.append("targetSpp", targetSpp.toString());
      if (texturepack) body.append("texturepack", texturepack);
      if (skymapRequired && skymap) body.append("skymap", skymap);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/jobs`,
        {
          method: "POST",
          headers: {
            "X-Api-Key": "NOT REQUIRED ANYMORE ONLY EXAMPLECODE",
          },
          body,
        },
      );

      if (res.status === 201) {
        const { _id } = await res.json();
        router.push(`/jobs/${_id}`);
      } else {
        throw new Error(await res.text());
      }
    } catch (e: any) {
      console.error(e);
      alert("Could not create job: " + e.message);
    } finally {
      setSubmitting(false);
    }
  }, [
    emitterGrid,
    emitterGridRequired,
    octree,
    sceneDescription,
    targetSpp,
    texturepack,
    skymap,
    skymapRequired,
    router,
  ]);

  const handleFiles = useCallback(
    (files: File[]) => {
      const json = files.find((f) => f.name.endsWith(".json"));
      if (json && sceneDescriptionRef.current) {
        sceneDescriptionRef.current.files = createFileList(json);
        handleSceneDescriptionFileChange(json);

        const sceneName = json.name.replace(/\.json$/, "");

        const octreeFile = files.find((f) => f.name === `${sceneName}.octree2`);
        if (octreeFile && octreeRef.current) {
          octreeRef.current.files = createFileList(octreeFile);
          setOctree(octreeFile);
        }

        const emitterGridFile = files.find(
          (f) => f.name === `${sceneName}.emittergrid`,
        );
        if (emitterGridFile && emitterGridRef.current) {
          emitterGridRef.current.files = createFileList(emitterGridFile);
          setEmitterGrid(emitterGridFile);
        }
      }
    },
    [handleSceneDescriptionFileChange],
  );

  const [dragging, setDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);

      if (folderDropSupported) {
        const folderEntry = Array.prototype.find
          .call(
            e.dataTransfer.items,
            (item: DataTransferItem) => item.webkitGetAsEntry()?.isDirectory,
          )
          ?.webkitGetAsEntry();

        if (folderEntry && folderEntry.isDirectory) {
          folderEntry
            .createReader()
            .readEntries(async (entries: FileSystemEntry[]) => {
              try {
                const files = await Promise.all(
                  entries
                    .filter((entry) => entry.isFile)
                    .map(
                      (entry) =>
                        new Promise<File>((resolve, reject) =>
                          (entry as FileSystemFileEntry).file(resolve, reject),
                        ),
                    ),
                );
                handleFiles(files);
              } catch (e) {
                console.error("Could not get files", e);
              }
            });
          return;
        }
      }

      handleFiles(Array.from(e.dataTransfer.files));
    },
    [handleFiles],
  );

  const HandlecreateJob = useCallback(async () => {
    {
      /*
Der Ablauf zum Erstellen von Jobs ist so:

1. createJob mit den dort benötigten Daten
2. Der Endpunkt liefert URLs zum Hochladen von Szene und Octree (und – falls die Szene braucht – Emittergrid) zurück, die jeweils direkt dorthin per PUT-Request hochladen, Dateiinhalt in den Body binär
3. Dann startJob aufrufen
      */
    }

    try {
      const res = await createJob({
        client,
        body: { spp: targetSpp, width: 0, height: 0, createDump: true },
      });
      const data = (res as any)?.data;
      if (data) {
        console.log(data);
      } else {
        console.warn("No data returned from create node response");
      }
    } catch (e) {
      console.error("Failed to create node", e);
    }
  }, [client]);

  /*
   * TODO: Add Explanation Questionmark Circles
   *
   */

  return (
    <>
      <div
        className="hero min-h-screen relative"
        style={{
          backgroundImage: "url(/images/boscawinks-Basalt_Deltas_be_like.png)",
        }}
      >
        <div className="px-6 py-8 max-w-4xl mx-auto">
          <fieldset className="fieldset bg-base-200/95 border-base-300 rounded-box border p-8 shadow">
            <legend className="fieldset-legend text-3xl font-bold">
              Create a new Render Job
            </legend>
            <div
              className={`mt-4 p-4 rounded-lg border-2 ${
                dragging
                  ? "border-primary bg-base-100"
                  : "border-dashed border-base-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <p className="text-base leading-relaxed mb-6">
                To create a new render job, please select your scene files below
                and fill out the required fields.
                <br />
                You can also drag and drop the files
                {folderDropSupported && " (or the scene folder)"} anywhere on
                this page.
              </p>

              <div className="form-control w-full mb-4">
                <label className="label" htmlFor="sceneDescription">
                  <span className="label-text text-base font-bold">
                    Scene description* (.json)
                  </span>
                </label>
                <input
                  type="file"
                  className={`file-input file-input-bordered w-full ${
                    showValidation && !sceneDescription
                      ? "file-input-error"
                      : ""
                  }`}
                  id="sceneDescription"
                  accept=".json"
                  onChange={handleSceneDescriptionChange}
                  ref={sceneDescriptionRef}
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label" htmlFor="octree">
                  <span className="label-text text-base font-bold">
                    Octree* (.octree2)
                  </span>
                </label>
                <input
                  type="file"
                  className={`file-input file-input-bordered w-full ${
                    showValidation && !octree ? "file-input-error" : ""
                  }`}
                  id="octree"
                  accept=".octree2"
                  onChange={(e) => setOctree(e.target.files?.[0])}
                  ref={octreeRef}
                />
              </div>

              <div className="form-control w-full mb-4">
                <label className="label" htmlFor="emitterGrid">
                  <span className="label-text text-base font-bold">
                    Emitter grid (.emittergrid)
                  </span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  id="emitterGrid"
                  accept=".emittergrid"
                  onChange={(e) => setEmitterGrid(e.target.files?.[0])}
                  ref={emitterGridRef}
                />
              </div>

              <div className="form-control w-full mb-6">
                <label className="label" htmlFor="skymap">
                  <span className="label-text text-base font-bold">
                    Skymap (.hdr, .exr)
                  </span>
                </label>
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  id="skymap"
                  accept=".hdr, .exr"
                  onChange={(e) => setSkymap(e.target.files?.[0])}
                  ref={skymapRef}
                />
              </div>

              <div className="form-control w-full mb-6 menu-vertical">
                <label className="label" htmlFor="targetSpp">
                  <span className="label-text text-base font-bold">
                    Target SPP
                  </span>
                </label>
                <input
                  type="number"
                  placeholder="Target SPP"
                  className="input input-bordered input-md w-40 mb-3"
                  value={targetSpp}
                  step={100}
                  onChange={(e) => setTargetSpp(Number(e.target.value))}
                />
                <input
                  type="range"
                  min={500}
                  max="10000"
                  id="targetSpp"
                  value={targetSpp}
                  onChange={(e) => setTargetSpp(Number(e.target.value))}
                  className="range range-primary w-full"
                  step="100"
                />
                <div className="flex justify-between px-2.5 mt-2 text-xs">
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                  <span>|</span>
                </div>
                <div className="flex justify-between px-2.5 mt-2 text-xs">
                  <span>500</span>
                  <span>2500</span>
                  <span>5000</span>
                  <span>7500</span>
                  <span>10000</span>
                </div>
              </div>

              <div className="form-control w-full mb-4 menu-vertical">
                <label className="label" htmlFor="Create Dump">
                  <span className="label-text text-base font-bold">
                    Create Dump
                  </span>
                </label>

                <label className="toggle toggle-error m-2">
                  <input
                    type="checkbox"
                    checked={renderDump}
                    onChange={(e) => setRenderDump(e.target.checked)}
                  />

                  {/* OFF */}
                  <svg
                    aria-label="off"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M18 6 6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* ON */}
                  <svg
                    aria-label="on"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M20 6 9 17l-5-5"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </label>
              </div>

              <label className="label" htmlFor="texturepack">
                <span className="label-text text-base font-bold">
                  Texture pack
                </span>
              </label>
              <div className="select w-full mb-6">
                <select
                  id="texturepack"
                  className="select select-bordered w-full"
                  value={texturepack}
                  onChange={(e) => setTexturepack(e.target.value)}
                >
                  {/* we get these resourcepacks from /api/resourcepacks */}
                  {resourcePacks.map(({ name, displayName }) => (
                    <option key={name} value={name}>
                      {displayName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button with Hover text of what is missing to being enabled */}

              <div
                className="peer tooltip w-full"
                data-tip={
                  submitting
                    ? "Submitting your render job..."
                    : !sceneDescription || !octree
                      ? `Missing required fields: ${[
                          !sceneDescription && "Scene description",
                          !octree && "Octree",
                        ]
                          .filter(Boolean)
                          .join(", ")}`
                      : "Click to submit your render job"
                }
              >
                <button
                  className={`btn btn-primary w-full ${
                    showValidation && (!sceneDescription || !octree)
                      ? "btn-error"
                      : ""
                  }`}
                  onClick={handleSubmit}
                >
                  {submitting ? (
                    <span className="loading loading-spinner loading-md"></span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
}
