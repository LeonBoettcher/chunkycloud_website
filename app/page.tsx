"use client";

import Link from "next/link";
import React from "react";
import HeroCards from "../components/Index/HeroCards";
import { env } from "process";

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
                <HeroCards
                  Title="Create a new job"
                  Description="Upload your scene and render it on a distributed server farm."
                  Link="/new"
                />
                <HeroCards
                  Title="Join the render farm"
                  Description="Get the render node software and add contribute computing power."
                  Link="/join"
                />
                <HeroCards
                  Title="Statistics"
                  Description="See how ChunkyCloud is doing and some numbers."
                  Link="/stats"
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
