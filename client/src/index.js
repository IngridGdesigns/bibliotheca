import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from '@auth0/auth0-react';
// import { useRedirectCallback } from "./Auth0ProviderWithNavigate"

const container = document.getElementById("root");
const root = createRoot(container);

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <Auth0ProviderWithNavigate> {/*power the routing and user authentication features of app*} */}
//         <App />
//       </Auth0ProviderWithNavigate>
//     </BrowserRouter>
//   </React.StrictMode>
// );

 

  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const redirectUri = process.env.REACT_APP_AUTH0_CALLBACKURL;

//   //  const onRedirectCallback = (appState) => {
//   //   navigate(appState?.returnTo || window.location.pathname);
//   // };


root.render(
  <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.Location.origin || redirectUri,
    }}
    // onRedirectCallback={useRedirectCallback}
  >
    <App/>
  </Auth0Provider>
);

 // <React.StrictMode>
  //   <App />
  // </React.StrictMode>

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();