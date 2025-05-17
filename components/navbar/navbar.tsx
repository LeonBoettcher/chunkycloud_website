"use client";

import Link from "next/link";
import React from "react";
import LoginButton from "./LoginButton";
import { SessionProvider } from "next-auth/react";

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
        <Link href="/" className="btn btn-ghost text-xl">
          ChunkyCloud
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 ">
          <li className="mr-4">
            <Link href="/">Home</Link>
          </li>
          <li className="mr-4">
            <Link href="/new">New</Link>
          </li>
          <li className="mr-4">
            <Link href="/jobs">Jobs</Link>
          </li>
          <li className="mr-4">
            <Link href="/join">Join</Link>
          </li>
          <li className="mr-4">
            <Link href="/stats">Stats</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <SessionProvider>
          <LoginButton />
        </SessionProvider>
      </div>
    </div>
  );
};

export default NavBar;
