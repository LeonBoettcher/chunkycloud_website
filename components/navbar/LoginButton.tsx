"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSession } from "../../app/auth/components/SessionProvider";
import {
  getCurrentUser,
  createNode,
  resetNodeToken,
} from "../../lib/api-client";

const LoginButton = () => {
  const { isLoggedIn, logout, client } = useSession();
  const [session, setSession] = useState<{ displayName: string }>();
  const [nodeTokens, setNodeTokens] = useState<{ id: number; token: string }[]>(
    [],
  );

  const handleTokenReset = useCallback(
    async (nodeId: number) => {
      try {
        const res = await resetNodeToken({ client, path: { id: nodeId } });
        const newToken: string | undefined = (res as any)?.data?.token;
        if (newToken) {
          setNodeTokens((prevTokens) =>
            prevTokens.map((token) =>
              token.id === nodeId ? { ...token, token: newToken } : token,
            ),
          );
        } else {
          console.warn("No token returned from response");
        }
      } catch (e) {
        console.error("Failed to reset node token", e);
      }
    },
    [client],
  );

  const handleCreateNode = useCallback(async () => {
    try {
      const res = await createNode({ client, body: { name: "web-ui" } });
      const newNode = res as any;
      if (newNode?.data) {
        setNodeTokens((prevTokens) => [
          ...prevTokens,
          { id: newNode.data.id, token: newNode.data.token },
        ]);
      } else {
        console.warn("No data returned from create node response");
      }
    } catch (e) {
      console.error("Failed to create node", e);
    }
  }, [client]);

  useEffect(() => {
    const ac = new AbortController();
    if (isLoggedIn) {
      getCurrentUser({ client, signal: ac.signal })
        .then((user) => setSession(user.data))
        .catch((e) => {
          console.error("Failed to get user", e);
        });
    }
  }, [isLoggedIn, client]);

  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // If modal is open and click is outside the modal box, close it
      if (
        isOpen &&
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      // If Escape key is pressed, close the modal
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    // Cleanup event listeners on unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (isLoggedIn) {
    return (
      <>
        <div className="badge badge-neutral mr-5">
          123456789
          <svg
            width="200%"
            height="200%"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 5C13 6.10457 10.5376 7 7.5 7C4.46243 7 2 6.10457 2 5M13 5C13 3.89543 10.5376 3 7.5 3C4.46243 3 2 3.89543 2 5M13 5V9.45715C11.7785 9.82398 11 10.3789 11 11M2 5V17C2 18.1046 4.46243 19 7.5 19C8.82963 19 10.0491 18.8284 11 18.5429V11M2 9C2 10.1046 4.46243 11 7.5 11C8.82963 11 10.0491 10.8284 11 10.5429M2 13C2 14.1046 4.46243 15 7.5 15C8.82963 15 10.0491 14.8284 11 14.5429M22 11C22 12.1046 19.5376 13 16.5 13C13.4624 13 11 12.1046 11 11M22 11C22 9.89543 19.5376 9 16.5 9C13.4624 9 11 9.89543 11 11M22 11V19C22 20.1046 19.5376 21 16.5 21C13.4624 21 11 20.1046 11 19V11M22 15C22 16.1046 19.5376 17 16.5 17C13.4624 17 11 16.1046 11 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar mr-2"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-10 rounded-full">
            <img alt="Avatar" src={"https://placehold.co/10x10/png"} />
          </div>
        </div>
        {isOpen && (
          <div className="modal modal-open">
            <div className="modal-box text-center" ref={modalRef}>
              <p className="py-4">{session?.displayName}</p>
              {/* Node Tokens Table */}
              {nodeTokens.length > 0 && (
                <>
                  <p className="py-4 text-2xl">Node Tokens</p>
                  <div className="overflow-x-auto">
                    <table className="table">
                      {/* head */}
                      <thead>
                        <tr>
                          <th></th>
                          <th>Token</th>
                          <th></th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* rows */}
                        {nodeTokens.map((token, index) => (
                          <tr key={token.id}>
                            {/* ID */}
                            <th>{index + 1}</th>

                            {/* Token */}
                            {token.token && (
                              <td className="truncate max-w-xs">
                                {token.token}
                              </td>
                            )}
                            {!token.token && (
                              <td className="text-gray-400">••••••••••</td>
                            )}

                            <td>
                              <button
                                className="btn btn-ghost btn-xs"
                                onClick={() => handleTokenReset(token.id)}
                              >
                                Reset
                              </button>
                            </td>
                            <td>
                              <button
                                className="btn btn-secondary btn-xs"
                                onClick={() =>
                                  setNodeTokens((prev) =>
                                    prev.filter((x) => x.id !== token.id),
                                  )
                                }
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              <button
                className="btn btn-primary mt-4"
                onClick={handleCreateNode}
              >
                Create Node Token
              </button>
              <div className="modal-action">
                <button
                  className="btn"
                  onClick={() => {
                    setIsOpen(false);
                    logout().catch((e) => {
                      console.error("Logout failed", e);
                    });
                  }}
                >
                  Logout
                </button>
                <button className="btn" onClick={() => setIsOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
  return (
    <a className="btn" href="/auth/init">
      Login
    </a>
  );
};

export default LoginButton;
