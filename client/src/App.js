import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import { Container } from "reactstrap";

import { AuthenticationGuard } from "./components/authentication-guard";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";

import Home from "./views/Home";
import Profile from "./views/Profile";
import { AdminPage } from "./pages/admin-page";
// import UserProfile from "./views/UserProfile";
import ExternalApi from "./views/ExternalApi";
import { useAuth0 } from "@auth0/auth0-react";

// styles
import "./App.css";
import AdminDashboard from "./components/AdminDashboard";

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
            
            <Route path="/dashboard" element={<AuthenticationGuard component={AdminDashboard} />} />
            
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
