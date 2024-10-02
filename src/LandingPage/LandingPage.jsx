import React from "react";
import Header from "./Header/Header";
import HeroSection from "./HeroSection/HeroSection";
import AutomateEmails from "./AutomateEmails/AutomateEmails";
import AllInclusive from "./AllInclusive/AllInclusive";
import OptimizeSection from "./OptimizeSection/OptimizeSection";
import Footer from "./Footer/Footer";

const LandingPage = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <AutomateEmails />
      <AllInclusive />
      <OptimizeSection />
      <Footer />
    </div>
  );
};

export default LandingPage;
