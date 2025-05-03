import Link from "next/link";
import React from "react";
import HeroCards from "../components/Index/HeroCards";

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
          <div>
            <div>
              <h1 className="mb-5 text-7xl font-bold">Welcome to</h1>
              <h1 className="mb-5 text-7xl font-bold">ChunkyCloud!</h1>
              <p className="mb-5 text-2xl">
                A distributed rendering service for{" "}
                <Link className="underline" href="https://chunky.lemaik.de/">
                  Chunky
                </Link>
              </p>
              <div className="pt-25 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
      </div>
    </>
  );
};

export default MainPage;
