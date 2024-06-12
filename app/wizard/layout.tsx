import React from "react";
// import { ClerkProvider } from "@clerk/nextjs";

const WizardLayoutPage = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center">
      {children}
    </div>
  );
};

export default WizardLayoutPage;
