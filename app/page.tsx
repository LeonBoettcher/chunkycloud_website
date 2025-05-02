import Link from "next/link";
import React from "react";

const MainPage = () => {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: "url(/images/Bluelix-swamp_and_mountain.png)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Hello there</h1>
            <p className="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
      <div>
        <main>
          <h1 className="bg-amber-200 text-9xl">Welcome to ChunkyCloud!</h1>

          <p>
            A distributed rendering service for{" "}
            <a href="https://chunky.lemaik.de/">Chunky</a>.
          </p>

          <div>
            <a href="/new">
              <h3>Create a new job &rarr;</h3>
              <p>
                Upload your scene and render it on a distributed server farm.
              </p>
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
    </>
  );
};

export default MainPage;
