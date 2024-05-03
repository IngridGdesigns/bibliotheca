import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Container } from "reactstrap";

import { AuthenticationGuard } from "./components/authentication-guard";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
// import auth from "./services/auth";
import Home from "./views/Home";
import Profile from "./views/Profile";
import { AdminPage } from "./pages/admin-page";
// import UserProfile from "./views/UserProfile";
import ExternalApi from "./views/ExternalApi";
import { useAuth0 } from "@auth0/auth0-react";

// styles
import "./App.css";
import Dashboard from "./components/Dashboard";
import BookManagement from "./Books/BookManagement";


const App = () => {
  const { isLoading, error } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router>
      <div id="app" className="d-flex flex-column h-100">
        <NavBar />
        <Container className="flex-grow-1 mt-5">
          <Routes>
            <Route path="/" exact element={<Home/>} />
            <Route path="/profile" element={<AuthenticationGuard component={Profile} />} />
            
            <Route path="/admin" element={<AuthenticationGuard component={AdminPage} />} />

            <Route path="/managebooks" element={<BookManagement component={AdminPage} /> } />
            
           <Route path="/dashboard" element={<Dashboard/>} />
            
            <Route path="/external-api" element={<AuthenticationGuard component={ExternalApi} />} />
            
            {/* for testing purposes */}
                  {/* <Route path="/userProfile" element={<AuthenticationGuard component={UserProfile} />} */}
          {/* /> */}


          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;

/*
const withClaimCheck = (Component, myClaimCheckFunction, returnTo) => {
  const { user } =  useAuth0();
  if (myClaimCheckFunction(user)) {
    return <Component />
  }
  Router.push(returnTo);
}

const checkClaims = (claim?: User) => claim?.['https://my.app.io/jwt/claims']?.ROLE?.includes('ADMIN');

// Usage
const Page = withAuthenticationRequired(
  withClaimCheck(Component, checkClaims, '/missing-roles' )
);

*/