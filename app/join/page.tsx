import React from "react";
import AccordionSection from "../../components/join/section";

const DocsPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 prose prose-neutral dark:prose-invert">
      <h2>Join the render farm</h2>
      <p>
        ChunkyCloud is made possible by all the people that contribute their
        computing power for others to render their scenes on.
      </p>
      <p>
        Under the hood, scenes get split up and rendered on multiple nodes in
        parallel and the resulting images are merged back together.
      </p>
      <p>
        This guide explains how to add a PC or server (called a{" "}
        <em>render node</em>) to ChunkyCloud.
      </p>

      <h3>1. Get an API key</h3>
      <p>
        In order to add your node, you need an <em>API key</em>. Currently, this
        process isn't automated, so ping <strong>leMaik</strong> on the Chunky
        Discord.
      </p>
      <p>
        The API key is used to identify users and give us a way to exclude
        malicious users. In the future, it will also be used to give you credits
        for rendering that you can then use to create render jobs.
      </p>
      <p>
        Until this is ready, you can render as much as you want (but please keep
        it fair).
      </p>

      <h3>2. Download the render node software</h3>
      <p>
        Once you have an API key, download the latest version from the{" "}
        <a
          className="link link-primary"
          href="https://github.com/ChunkyCloud/render-node/releases/latest"
          target="_blank"
          rel="noopener noreferrer"
        >
          releases page
        </a>
        .
      </p>
      <p>
        Make sure that you <strong>always use the latest version</strong>. If
        there are breaking changes, your node may not be able to connect anymore
        without being updated.
      </p>

      <h3>3. Launch the node</h3>
      <p>
        Open a command prompt in the directory that contains the{" "}
        <code>.jar</code> file and run the following command to start the node
        (change the filename accordingly):
      </p>
      <pre className="bg-base-200 p-4 rounded-md overflow-x-auto text-sm">
        <code>java -Xmx8g -jar cc-rendernode-1.0.0.jar --api-key</code>
      </pre>
      <p>
        Adjust <code>-Xmx</code> to the amount of memory you want to dedicate.
        In the example, it's <strong>8 GB</strong>. Don’t assign too much memory
        – running out might destabilize your system.
      </p>
      <p>
        Additional options:
        <ul>
          <li>
            <code>-t</code>: number of render threads (e.g. <code>-t 2</code>{" "}
            uses 2 threads). If omitted, all logical CPU cores are used.
          </li>
          <li>
            <code>--name</code>: give your node a name for the stats page, e.g.{" "}
            <code>--name "leMaik's PC"</code>
          </li>
        </ul>
      </p>

      <p>
        The node will create working directories, download Minecraft (for
        default textures), and connect to ChunkyCloud.
      </p>
      <p>
        At this point, your node is ready and will be assigned tasks as soon as
        they arrive. Look back at the command prompt – it might already be
        rendering!
      </p>

      <h2>Frequently Asked Questions</h2>

      <AccordionSection
        Title="How do I stop the render node?"
        Content="You can stop your render node at any time by closing the command prompt. If you were rendering something, it will be put back into the queue and get rendered by another node."
      />
      <AccordionSection
        Title="What exactly does my PC do when it's in the render farm?"
        Content="Your PC connects to ChunkyCloud's RabbitMQ queue to get render tasks. When it gets a task, it downloads all required files from the ChunkyCloud server, renders the scene using Chunky and then uploads the render dump into another RabbitMQ queue."
      />
      <AccordionSection
        Title="Can I use Docker?"
        Content={
          <>
            <p>Absolutely! There even is a Docker image you can use:</p>
            <div className="mockup-code w-full my-2">
              <pre data-prefix="$">
                <code>
                  docker run --name cc-node lemaik/chunkycloud-renderer:latest
                  --api-key
                </code>
              </pre>
            </div>
            <p>
              You can also specify the API key with an environment variable:{" "}
              <code>-e API_KEY=YOUR-API-KEY-HERE</code>
            </p>
          </>
        }
      />
    </div>
  );
};

export default DocsPage;
