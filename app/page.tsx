import Link from "next/link";
import React from "react";

const MainPage = () => {
  return (
    <div>
      <main>
        <h1>Welcome to ChunkyCloud!</h1>

        <p>
          A distributed rendering service for{" "}
          <a href="https://chunky.lemaik.de/">Chunky</a>.
        </p>

        <div>
          <a href="/new">
            <h3>Create a new job &rarr;</h3>
            <p>Upload your scene and render it on a distributed server farm.</p>
          </a>

          <a href="/stats">
            <h3>Statistics &rarr;</h3>
            <p>See how ChunkyCloud is doing and some numbers.</p>
          </a>

          <a href="/join">
            <h3>Join the render farm &rarr;</h3>
            <p>
              Get the render node software and add contribute computing power.
            </p>
          </a>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
