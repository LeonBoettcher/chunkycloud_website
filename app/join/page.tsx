import React from "react";
import AccordionSection from "../../components/Join/AccordionSection";
import Link from "next/link";
//import { toFormData } from "axios";

const DocsPage = () => {
  return (
    /*
     * RODO: add  Version Tag for latest git release of rendernode and change 3. Accordingly (e.g. filename in Launch Node)
     * TODO: Add Images or animations for explaination
     * TODO Make each text segment a seperated section
     */
    <div
      className="hero min-h-screen relative"
      style={{
        backgroundImage: "url(/images/boscawinks-Give_that_back.png)",
      }}
    >
      <fieldset className="fieldset bg-base-200/95 border-base-300 rounded-box border p-8 shadow mb-8">
        <legend className="fieldset-legend text-3xl font-bold">
          How to start Rendering
        </legend>
        <div className={`mt-4 p-4 rounded-lg border-2`}>
          <div className="max-w-3xl mb-8 mx-auto px-4 py-10 prose prose-neutral dark:prose-invert">
            <h2>Join the render farm</h2>
            <p>
              ChunkyCloud is made possible by all the people that contribute
              their computing power for others to render their scenes on.
            </p>
            <p>
              Under the hood, scenes get split up and rendered on multiple nodes
              in parallel and the resulting images are merged back together.
            </p>
            <p>
              This guide explains how to add a PC or server (called a{" "}
              <em>render node</em>) to ChunkyCloud.
            </p>

            <h3>1. Get an Node Token</h3>
            <p>
              In order to add your node, you need an <em>Node Token</em>. You
              can create a Node Token in your{" "}
              <Link href="/account">Account</Link>.
            </p>
            <p>
              The Node Token is used to identify nodes and give us a way to
              identify and exclude malicious nodes. In the future, it will also
              be used to give you credits for rendering that you can then use to
              create render jobs.
            </p>
            <p>
              Until this is ready, you can render as much as you want (but
              please keep it fair).
            </p>

            <h3>2. Download the render node software</h3>
            <p>
              Once you have a Node Token, download the latest version from the{" "}
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
              Make sure that you <strong>always use the latest version</strong>.
              If there are breaking changes, your node may not be able to
              connect anymore without being updated.
            </p>

            <h3>3. Launch the node</h3>
            <p>
              Open a command prompt in the directory that contains the{" "}
              <code>.jar</code> file and run the following command to start the
              node (change the filename accordingly):
            </p>
            <pre className="bg-base-200 p-4 rounded-md overflow-x-auto text-sm">
              <code>java -jar cc-rendernode-1.0.0.jar --api-key</code>
            </pre>
            <h4>Available parameters</h4>
            <p>
              Use these flags to customize how your render node connects and
              stores temporary data.
            </p>
            <div className="not-prose overflow-x-auto rounded-lg border border-base-300 bg-base-100">
              <table className="table table-zebra w-full text-sm">
                <thead>
                  <tr>
                    <th>Option</th>
                    <th>Default</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <code>--api</code>
                    </td>
                    <td>
                      <code>https://api.chunkycloud.lemaik.de</code>
                    </td>
                    <td>ChunkyCloud API endpoint.</td>
                  </tr>
                  <tr>
                    <td>
                      <code>--api-key</code>
                    </td>
                    <td>
                      <code>unset</code>
                    </td>
                    <td>Render-node API key.</td>
                  </tr>
                  <tr>
                    <td>
                      <code>--api-key-file</code>
                    </td>
                    <td>
                      <code>unset</code>
                    </td>
                    <td>
                      File containing the render-node API key. Useful for
                      container secrets.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>--cpu-load</code>
                    </td>
                    <td>
                      <code>100</code>
                    </td>
                    <td>Maximum Chunky CPU load.</td>
                  </tr>
                  <tr>
                    <td>
                      <code>-t</code>, <code>--thread-count</code>
                    </td>
                    <td>
                      <code>2</code>
                    </td>
                    <td>Number of render threads used by Chunky.</td>
                  </tr>
                  <tr>
                    <td>
                      <code>--job-path</code>
                    </td>
                    <td>
                      <code>./rs_jobs</code>
                    </td>
                    <td>Directory for temporary per-task data.</td>
                  </tr>
                  <tr>
                    <td>
                      <code>--texturepacks-path</code>
                    </td>
                    <td>
                      <code>./rs_texturepacks</code>
                    </td>
                    <td>Directory for downloaded resource packs.</td>
                  </tr>
                  <tr>
                    <td>
                      <code>--cache-directory</code>
                    </td>
                    <td>
                      <code>./rs_cache</code>
                    </td>
                    <td>
                      HTTP cache directory for downloaded scene resources.
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <code>--max-cache-size</code>
                    </td>
                    <td>
                      <code>512</code>
                    </td>
                    <td>Maximum HTTP cache size, in MB.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p>
              The node will create working directories, download Minecraft (for
              default textures), and connect to ChunkyCloud.
            </p>
            <p>
              At this point, your node is ready and will be assigned tasks as
              soon as they arrive. Look back at the command prompt – it might
              already be rendering!
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
                        docker run --name cc-node
                        lemaik/chunkycloud-renderer:latest --api-key
                      </code>
                    </pre>
                  </div>
                  <p>
                    You can also specify the API key with an environment
                    variable: <code>-e API_KEY=YOUR-API-KEY-HERE</code>
                  </p>
                </>
              }
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default DocsPage;
