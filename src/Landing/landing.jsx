import React from "react";
import "./landing.css";
import Navbar from "../Navbar/navbar";
import Home from "./Home/home";
import Features from "./Features/features";
import HowItWorks from "./HowItWorks/works";
import Intuitive from "./Intuitive/Intuitive";
import Contact from "./Contact/contact";

const Landing = () => {
  return (
    <>
      <Navbar />
      <Home />
      <Features />
      <HowItWorks />
      <Intuitive />
      <Contact />
    </>
  );
};

export default Landing;
