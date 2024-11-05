import React from "react";

import NavbarWrapper from "@/components/navbar-wrapper";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <NavbarWrapper />
      {children}
    </>
  );
};

export default DashboardLayout;
