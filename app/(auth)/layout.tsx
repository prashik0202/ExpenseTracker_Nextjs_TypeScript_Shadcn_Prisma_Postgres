import React from "react";
import Logo from "@/components/Logo";

const ClerkAuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center relative">
      <Logo />
      <div className="mt-12">{children}</div>
    </div>
  );
};

export default ClerkAuthLayout;
