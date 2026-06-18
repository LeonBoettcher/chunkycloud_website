import { useEffect, useRef } from "react";

interface AccountModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  session?: { displayName: string };
  nodeTokens: { id: number; token: string; name: string }[];
  setNodeTokens: (
    tokens: { id: number; token: string; name: string }[],
  ) => void;
  nodeName: string;
  setNodeName: (name: string) => void;
  handleTokenReset: (nodeId: number) => Promise<void>;
  handleCreateNodeToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AccountModal = ({
  isOpen,
  setIsOpen,
  session,
  nodeTokens,
  setNodeTokens,
  nodeName,
  setNodeName,
  handleTokenReset,
  handleCreateNodeToken,
  logout,
}: AccountModalProps) => {
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
  }, [isOpen, setIsOpen]);

  return isOpen ? (
    <div className="modal modal-open">
      <div className="modal-box text-center max-w-4xl w-full" ref={modalRef}>
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
                    <th>ID</th>
                    <th>Name</th>

                    <th>
                      <div
                        className="tooltip tooltip-left"
                        data-tip="Click to copy"
                      >
                        Token
                      </div>
                    </th>

                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* rows */}
                  {nodeTokens.map((token, index) => (
                    <tr key={token.id}>
                      {/* ID */}
                      <th>{token.id}</th>

                      {/* Token Name */}
                      <td>{token.name}</td>
                      {/* Token */}
                      {token.token && (
                        <td className="truncate max-w-xs">
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() =>
                              navigator.clipboard.writeText(token.token ?? "")
                            }
                          >
                            {token.token}
                          </button>
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
                            setNodeTokens(
                              nodeTokens.filter((x) => x.id !== token.id),
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

        <div className="join">
          <div>
            <label className="input validator join-item">
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="MY Nodetoken"
                required
              />
            </label>
          </div>
          <button
            className="btn btn-neutral join-item"
            onClick={handleCreateNodeToken}
            disabled={!nodeName.trim()}
          >
            Create
          </button>
        </div>

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
  ) : null;
};
