import React from "react";
import { LoginButton } from "./buttons/login-button";
import logo from "../assets/icons8-book-bubbles-96.png";

const Hero = () => (
  <div className="text-center hero my-5">
    <img className="mb-3 app-logo" src={logo} alt="React logo" width="120" />
    <div>
      <div className="bg">
        <h1 className="mb-4">Bibliotheca</h1>
        <p className="lead">
              Welcome to our Library site, please sign in or Register!
        </p>
         
          <LoginButton />
    </div>

    </div>
  </div>
);

export default Hero;
