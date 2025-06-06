"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";

const LoginButton_old = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [coins, setCoins] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Ref to track the modal box (for outside click detection)
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

  async function getCookies() {}

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const token = formData.get("token") as string;

    const response = await fetch("http://localhost:3213/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    const result = await response.json();

    console.log(result);

    if (response.ok && result.user) {
      const coins = result.user.coins;
      console.log(coins);
      setCoins(coins);
      setIsLoggedIn(true);
      setIsOpen(false);
    }
  }

  //TODO Coins only get "fetched" from the server on login, not on refresh, ADD Coins refresh while logged in
  return (
    <>
      {isLoggedIn ? (
        <div>
          <div className="badge badge-neutral">
            {coins}
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE4UlEQVR4nO1Z224bVRRd5IaUqkU0SUnVwF+A2g9BRfAhoHwA7TuggPgDUMsDlxekODS3VnHqSyexZ8aTpGl4IQ1vY884Ptlon7n4jBPic8ZOClKOtJRRJHvW2mfvffZZBq7W1bpaAy8ijJKLe+RhXnh4JDxsCRd/iwbaEvzswBIuHpGLeXJwlwgjb564i/eFh4fCw8GJB0rR6IHbAwckbLwSNh6Qg7nLJ+5gRnj4TuwgzBDXJK9C2AhFHQtUx/TlkPfwqfBwdLKTJS4cULsMCp+BWiug5hLIX4zAz/y/8CmoXQKJWizA7kLYeE02Prk44kWMix18L4kr5DtboGAd5Be6hHUQrIE6VUVEPYKo41t+13DJ/4lJ4eE3lbywIxImpP9NiLC6AqSIGn6lIiaHF/ke8u2KecTPRSFKLSmA06sGohp+JwsTAwvoTZuwNETii1m0n6XkI2xjYbDoe/gsE/nNiyPvJyI2UvIRtnA/H/kDTIkdHGbSZvFycLypCNjGUa4Wy31eLVh/KQeR7Xcl8tTESTXdASIL35hF38Gcekjl7TbHtZsSeT4brMbkI4Rk4QOT6D9MyB9vm724+ccIhZXr1HGm6eTlbQmx8x513GlqV26Qv/SW9neJkiLiBR7oRZ8wIjy8SqPPh5TmC1srY5JsQvwsBOtvm++CJXFAP2C0vwAX99TxwCT6HOWEaKcxIyPert6QdZAIC57qC/AX41qwUnzUX4CH+USASedpLo91ybsz5BdOp4qMvkEK+VxHRUVAFV/o5P/jZKrkwUw7fdYmUgHH9XyF65+BcC0m/0IK+FFHgJWMwjxBau/Ak9Furu/dpvD5taGMG63lmHyEan8BLo4SAepIrLXdtZuZghWNGQo3r1HTMG18NTAFRUAVh/0FNBAmAkwjyC20Y0+d6jxid1a21uYZdeH3gyqggkBfgJtz4iyAwuIkCe/WaSGNW9RaHssnoKorgFMovv6ZplDvi7llcgvlmkg7lDNtnkLVFBop5MBKBJgU8bmFuD5BYm82FcEt16iIqyk0itjB40QA32GHIaC3wFtr49qfC1cVAWWNNsq+TeIe8C3JhCTnfdt6R0ZcPchaq+MkdrsjRnNpRF/4Rpr//Pfz/gIc3E0tj5qZgEzR7s1KQb2zkel4fVKOyTOe40O9Yc7GfiLCZJTmEeK8QY4LmFut7vcFKwr5Ml5qu3nsmCW+DVsf2hErRAUblq9HA9zurAQ/c2s9az7yz0vJTUVABV9qkY/TaI4ds8SzeSMXmpVM9AMq4Y62ALkLdSykrpmV71DLe6Vs8pWylBHwlRF5uQsWbgobh4nZZNqRBkFnI0P+NRVz+qbsVaqOWbhx8eTb6xnyRCV8jEEWe5WqY9YuXiL5Mr4eiLzcBcKoqOEn1TFj34bzdFjEm4VTacP4hQoYG1iAFFHEJLHhqjhmfFflS/eg5IOVUwXLafPz0MxdRcQ4e5WKYyYdA1HOJ4SJi2yfT9NmaJE/U8gW7tMWDhXTSYJ3hC/gfIdtPYlHcU6zQvwDx3I0mPFskxkPKin5vwYuWG0R25hiu48sBIpv00X3Dtu9jKjIEg+4z3PbvhTyGSE27rBjRhb2jcmXsc/jgfEJeyFCCCNsOrFvw9YHuwdUxRFVEMbg5wrP8zwS81T5n/iZ9WpdLfz/1z8Apv6TxK69oQAAAABJRU5ErkJggg=="
              alt="cheap-2--v1"
            ></img>
          </div>
          <button className="btn" onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>
        </div>
      ) : (
        <button className="btn" onClick={() => setIsOpen(true)}>
          Login
        </button>
      )}

      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box text-center" ref={modalRef}>
            <p className="py-4">Input your API Key here</p>

            <form onSubmit={handleLogin}>
              <input
                name="token"
                className="input"
                placeholder="507f1f77bcf86cd799439011"
              />
              <button className="btn ml-3" type="submit">
                Login
              </button>
            </form>

            <div className="modal-action">
              <button className="btn" onClick={() => setIsOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginButton_old;
