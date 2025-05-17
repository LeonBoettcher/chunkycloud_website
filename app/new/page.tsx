"use client"; // <- Wichtig, damit Hooks verwendet werden dürfen
import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation"; // neuer Import!
import Head from "next/head";
import Header from "../../components/Header";

function createFileList(...files: File[]): FileList {
  const dataTransfer = new DataTransfer();
  files.forEach((file) => dataTransfer.items.add(file));
  return dataTransfer.files;
}

const folderDropSupported =
  typeof window !== "undefined" &&
  typeof DataTransferItem !== "undefined" &&
  !!DataTransferItem.prototype.webkitGetAsEntry &&
  typeof DataTransfer === "function";

export default function CreateJob({ resourcePacks }) {
  const router = useRouter();

  const [sceneDescription, setSceneDescription] = useState<File>();
  const [octree, setOctree] = useState<File>();
  const [emitterGrid, setEmitterGrid] = useState<File>();
  const [emitterGridRequired, setEmitterGridRequired] = useState(false);
  const [targetSpp, setTargetSpp] = useState(500);
  const [texturepack, setTexturepack] = useState<string>("");
  const [skymap, setSkymap] = useState<File>();
  const [skymapRequired, setSkymapRequired] = useState(false);
  const [apiKey, setApiKey] = useState("");

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
    []
  );

  const handleSceneDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleSceneDescriptionFileChange(e.target.files?.[0]);
    },
    [handleSceneDescriptionFileChange]
  );

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (!sceneDescription || !octree || !apiKey) {
      alert("Missing required fields.");
      return;
    }

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

      const res = await fetch("http://localhost:3213/api/jobs", {
        method: "POST",
        headers: {
          "X-Api-Key": apiKey,
        },
        body,
      });

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
    apiKey,
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
          (f) => f.name === `${sceneName}.emittergrid`
        );
        if (emitterGridFile && emitterGridRef.current) {
          emitterGridRef.current.files = createFileList(emitterGridFile);
          setEmitterGrid(emitterGridFile);
        }
      }
    },
    [handleSceneDescriptionFileChange]
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
            (item: DataTransferItem) => item.webkitGetAsEntry()?.isDirectory
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
                          (entry as FileSystemFileEntry).file(resolve, reject)
                        )
                    )
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
    [handleFiles]
  );

  return (
    <>
      <div
        className={`${dragging}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <h1 className="text-5xl">Create new render job</h1>
        <p>
          To create a new render job, please select your scene files below and
          fill out the required fields.
          <br />
          You can also drag and drop the files
          {folderDropSupported && " (or the scene folder)"} anywhere on this
          page.
        </p>
        <p>
          <label htmlFor="apiKey">API Key*: </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <br />
          <label htmlFor="sceneDescription">Scene description*: </label>
          <input
            type="file"
            id="sceneDescription"
            accept=".json"
            onChange={handleSceneDescriptionChange}
            ref={sceneDescriptionRef}
          />
          <br />
          <label htmlFor="octree">Octree*: </label>
          <input
            type="file"
            id="octree"
            accept=".octree2"
            onChange={(e) => setOctree(e.target.files?.[0])}
            ref={octreeRef}
          />
          <br />
          <label htmlFor="emitterGrid">Emitter grid: </label>
          <input
            type="file"
            id="emitterGrid"
            accept=".emittergrid"
            onChange={(e) => setEmitterGrid(e.target.files?.[0])}
            ref={emitterGridRef}
          />
          <br />
          <label htmlFor="skymap">Skymap: </label>
          <input
            type="file"
            id="skymap"
            accept=".hdr, .exr"
            onChange={(e) => setSkymap(e.target.files?.[0])}
            ref={skymapRef}
          />
          <br />
          <label htmlFor="targetSpp">Target SPP: </label>
          <input
            type="number"
            id="targetSpp"
            value={targetSpp}
            onChange={(e) => setTargetSpp(Number(e.target.value))}
          />
          <br />
          <label htmlFor="texturepack">Texture pack: </label>
          <input
            type="text"
            id="texturepack"
            value={texturepack}
            onChange={(e) => setTexturepack(e.target.value)}
          />
          <br />
          <button
            onClick={handleSubmit}
            disabled={submitting || !apiKey || !sceneDescription || !octree}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </p>
      </div>
    </>
  );
}
