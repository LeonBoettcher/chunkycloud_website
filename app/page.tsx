"use client";

import Link from "next/link";
import React from "react";
import HeroCard from "../components/Index/HeroCard";

const MainPage = () => {
  return (
    <>
      <div
        className="hero min-h-screen relative"
        style={{
          backgroundImage: "url(/images/Bluelix-swamp_and_mountain.png)",
        }}
      >
        {/* TODO Add Hero image cycler + add the Creator Tag 
        TODO: CHange the Buttons to New, Jobs, Stats, Join 
        TODO: Add STats + klickable and redirect to Stats Page
        TODO: add small animation for overall explaination
        */}

        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div>
            <div>
              <h1 className="mb-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                Welcome to
              </h1>
              <h1 className="mb-5 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
                ChunkyCloud!
              </h1>
              <p className="mb-5 text-lg sm:text-xl md:text-2xl">
                A distributed rendering service for{" "}
                <Link className="underline" href="https://chunky.lemaik.de/">
                  Chunky
                </Link>
              </p>
              <div className="pt-10 px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                <HeroCard
                  title="Create a new job"
                  description="Upload your scene and render it on a distributed server farm."
                  link="/new"
                />
                <HeroCard
                  title="Join the render farm"
                  description="Get the render node software and add contribute computing power."
                  link="/join"
                />
                <HeroCard
                  title="Statistics"
                  description="See how ChunkyCloud is doing and some numbers."
                  link="/stats"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-2 left-2 text-xs text-white/70">
          <Link href="https://chunky-dev.github.io/gallery/">
            "swamp and mountain" by Bluelix
          </Link>
        </div>
      </div>
    </>
  );
};

export default MainPage;
