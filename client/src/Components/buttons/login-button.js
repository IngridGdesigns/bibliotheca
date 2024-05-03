import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/profile", // tells auth0 to direct to profile
      },
      authorizationParams: {
        prompt: "login", //if not authorized, they are prompt to login
      },
    });
  };

  return (
    <button className="primary" onClick={handleLogin}>
      Log In
    </button>
  );
};
