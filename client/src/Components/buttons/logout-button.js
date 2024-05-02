import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin, //Auth0 React SDK clears the application session and redirects to the Auth0 /v2/logout endpoint to clear the Auth0 session under the hood.
      },
    });
  };

  return (
    <button className="button__logout" onClick={handleLogout}>
      Log Out
    </button>
  );
};
