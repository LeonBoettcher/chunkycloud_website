import React from "react";

const LoadingCards = () => {
  return (
    <>
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="skeleton h-80 p-4 space-y-3"></div>
      ))}
    </>
  );
};

export default LoadingCards;
