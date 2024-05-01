
import { useNavigate } from "react-router-dom";

export const useRedirectCallback = (appState) => {
  const navigate = useNavigate();

  // Determine where to redirect
  const redirectTo = appState && appState.returnTo ? appState.returnTo : '/';

  // Perform navigation
  navigate(redirectTo);
};

// export const Auth0ProviderWithNavigate = ({ children }) => {

//   const domain = process.env.REACT_APP_AUTH0_DOMAIN;
//   const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
//   const redirectUri = process.env.REACT_APP_AUTH0_CALLBACKURL;



//   return (
//     <Auth0Provider
//       domain={domain}
//       clientId={clientId}
//       authorizationParams={{
//         redirect_uri: redirectUri,
//       }}
//       onRedirectCallback={useRedirectCallback}
//     >
//       {children}
//     </Auth0Provider>
//   );
// };