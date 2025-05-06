import React from "react";

interface Variables {
  Title: string;
  Description: string;
  Link: string;
}

const HeroCards = ({ Title, Description, Link }: Variables) => {
  return (
    <a href={Link} className="block">
      <div className="card w-full max-w-sm mx-auto rounded-xl border border-base-200 bg-base-100/80 shadow-md transition-transform duration-300 ease-in-out hover:scale-101 hover:shadow-xl hover:bg-base-200/70 cursor-pointer">
        <div className="card-body space-y-2">
          <h2 className="card-title text-2xl font-semibold">{Title}</h2>
          <p className="text-base text-neutral-content">{Description}</p>
        </div>
      </div>
    </a>
  );
};

export default HeroCards;
