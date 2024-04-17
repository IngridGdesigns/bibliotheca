import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Auth0Provider } from '@auth0/auth0-react';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Auth0Provider
    domain="icodenow.auth0.com"
    clientId="DXRk7NIWjaNYZB0LCYOkWs0xyHYFGjrX"
    authorizationParams={{
      redirect_uri: window.location.origin // "http://localhost:3000/callback"
    }}
  >
    <App/>
  </Auth0Provider>
  // <React.StrictMode>
  //   <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
