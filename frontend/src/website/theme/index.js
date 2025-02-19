import React from "react";
import Navigation from "./Navigation";
import Footer from "./Footer";
const index = ({ children }) => {
  return (
    <div>
      <Navigation />
      {children}
      <Footer />
    </div>
  );
};

export default index;
