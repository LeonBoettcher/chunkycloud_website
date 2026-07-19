"use client";

import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

import type { ResourcePackResponse } from "../lib/api-client";

interface MultiSelectProps {
  packs: ResourcePackResponse[];
  value: ResourcePackResponse[];
  onChange: (packs: ResourcePackResponse[]) => void;
}

interface SortableItemProps {
  pack: ResourcePackResponse;
  remove: (id: number) => void;
}

function SortableItem({ pack, remove }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: pack.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="
        flex
        items-center
        gap-3
        bg-base-200
        rounded-lg
        p-3
      "
    >
      <button
        type="button"
        {...listeners}
        className="
          cursor-grab
          text-xl
          opacity-60
        "
      >
        ☰
      </button>

      <div className="flex-1">
        <div className="font-bold">{pack.name}</div>

        <div className="text-sm opacity-70">{pack.description}</div>
      </div>

      <button
        type="button"
        onClick={() => remove(pack.id)}
        className="
          btn
          btn-sm
          btn-error
        "
      >
        ✕
      </button>
    </div>
  );
}

export default function MultiSelect({
  packs,
  value,
  onChange,
}: MultiSelectProps) {
  const [selected, setSelected] = useState<ResourcePackResponse[]>(value);

  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  // Keep local state synced with parent
  useEffect(() => {
    setSelected(value);
  }, [value]);

  function update(items: ResourcePackResponse[]) {
    setSelected(items);
    onChange(items);
  }

  function toggle(pack: ResourcePackResponse) {
    const exists = selected.some((p) => p.id === pack.id);

    if (exists) {
      update(selected.filter((p) => p.id !== pack.id));
    } else {
      update([...selected, pack]);
    }
  }

  function remove(id: number) {
    update(selected.filter((p) => p.id !== id));
  }

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = selected.findIndex((p) => p.id === active.id);

    const newIndex = selected.findIndex((p) => p.id === over.id);

    update(arrayMove(selected, oldIndex, newIndex));
  }

  const filtered = packs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="w-full relative">
      {/* Selector */}
      <button
        type="button"
        className="
          input
          input-bordered
          w-full
          text-left
          flex
          items-center
        "
        onClick={() => setOpen((previous) => !previous)}
      >
        {selected.length === 0
          ? "Select resource packs..."
          : `${selected.length} packs selected`}
      </button>

      {open && (
        <div
          className="
              absolute
              z-50
              mt-2
              w-full
              bg-base-100
              rounded-box
              shadow-xl
              p-3
              border
              border-base-300
            "
        >
          <input
            type="text"
            className="
                input
                input-bordered
                w-full
                mb-3
              "
            placeholder="Search packs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div
            className="
                max-h-72
                overflow-y-auto
              "
          >
            {filtered.map((pack) => {
              const checked = selected.some((p) => p.id === pack.id);

              return (
                <label
                  key={pack.id}
                  className="
                          flex
                          items-center
                          gap-3
                          p-2
                          rounded
                          hover:bg-base-200
                          cursor-pointer
                        "
                >
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={checked}
                    onChange={() => toggle(pack)}
                  />

                  <div>
                    <div className="font-semibold">{pack.name}</div>

                    <div className="text-xs opacity-70">{pack.description}</div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Ordered selected packs */}

      {selected.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-bold">Load order</h3>

          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selected.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {selected.map((pack) => (
                <SortableItem key={pack.id} pack={pack} remove={remove} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}
