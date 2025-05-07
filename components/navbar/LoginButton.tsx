import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const LoginButton = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user?.name || "Unknown"} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      <button className="btn" onClick={() => signIn("discord")}>
        Sign in
      </button>
    </>
  );
};

export default LoginButton;
