import Link from "next/link";
import React from "react";

const commit = process.env.VERCEL_GIT_COMMIT_SHA;

const Footer = () => {
  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10 relative">
      <aside>
        <img src="/logo.png" alt="ChunkyCloud Logo" className="w-16 h-16" />
        <p className="font-bold">ChunkyCloud</p>
        <p className="text-sm text-gray-500">A Distributed Rendering Service</p>
      </aside>
      <nav>
        <h6 className="footer-title">Chunky</h6>
        <Link
          href="https://chunky-dev.github.io/docs/"
          rel="noopener noreferrer"
          target="_blank"
          className="link link-hover"
        >
          Website
        </Link>
        <Link
          href="https://www.reddit.com/r/chunky/"
          rel="noopener noreferrer"
          target="_blank"
          className="link link-hover"
        >
          Subreddit
        </Link>
        <Link
          href="https://discord.com/invite/VqcHpsF"
          rel="noopener noreferrer"
          target="_blank"
          className="link link-hover"
        >
          Discord
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Resources</h6>
        <Link
          href="https://github.com/ChunkyCloud"
          rel="noopener noreferrer"
          target="_blank"
          className="link link-hover"
        >
          Code on GitHub
        </Link>
        <Link
          href="https://api.chunkycloud.net/docs"
          rel="noopener noreferrer"
          target="_blank"
          className="link link-hover"
        >
          ChunkyCloud API
        </Link>
      </nav>
      {commit && (
        <div className="absolute bottom-4 right-10">
          <p className="text-xs text-gray-500">
            <a
              href={`https://github.com/ChunkyCloud/website/commit/${commit}`}
              rel="noopener noreferrer"
              target="_blank"
              title="Open the source code on GitHub"
            >
              {commit.substring(0, 7)}
            </a>
          </p>
        </div>
      )}
    </footer>
  );
};

export default Footer;
