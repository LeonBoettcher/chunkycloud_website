import React from "react";

const LoadingCards = () => {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="card w-full bg-gray-800/90 text-white shadow-lg border border-white/5"
        >
          <div className="card-body p-4 space-y-3">
            <div className="skeleton h-7 w-1/3 rounded" />
            <div className="skeleton aspect-video w-full rounded-md" />
            <div className="skeleton h-8 w-24 rounded-full" />

            <div className="space-y-2">
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-2/3 rounded" />
              <div className="skeleton h-4 w-1/3 rounded" />
            </div>

            <div className="space-y-2 pt-2">
              <div className="skeleton h-3 w-1/2 rounded" />
              <div className="skeleton h-3 w-full rounded" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LoadingCards;
