"use client";

import Link from "next/link";
import LoginButton from "./LoginButton";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-lg dropdown-content bg-base-100 rounded-box z-1 mt-3 w-150 p-2 shadow"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/new">New</Link>
            </li>
            <li>
              <Link href="/jobs">Jobs</Link>
            </li>
            <li>
              <Link href="/join">Join</Link>
            </li>
            <li>
              <Link href="/stats">Stats</Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="ml-4 text-xl">
          ChunkyCloud
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <div className="hidden sm:ml-6 sm:block">
          <ul className="flex space-x-4">
            <li className="px-3">
              <Link
                href="/new"
                className="relative inline-blockafter:content-[''] after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
              >
                New
              </Link>
            </li>

            <li className="px-3">
              <Link
                href="/jobs"
                className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
              >
                Jobs
              </Link>
            </li>

            <li className="px-3">
              <Link
                href="/join"
                className="relative inline-block  after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
              >
                Join
              </Link>
            </li>

            <li className="px-3">
              <Link
                href="/stats"
                className="relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:after:left-0"
              >
                Stats
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-end">
        <LoginButton />
      </div>
    </div>
  );
};

export default NavBar;
