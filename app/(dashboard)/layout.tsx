import Navbar from "@/components/Navbar";
import React from "react";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen relative w-full flex-col bg-card">
      <Navbar />
      {/* <Toaster position="bottom-right" /> */}
      <div className="w-full">{children}</div>
    </div>
  );
};

export default DashBoardLayout;
