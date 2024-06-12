import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

import CreateTransactionDialog from "./_components/CreateTransactionDialog";
import OverView from "./_components/OverView";
import History from "./_components/History";

const page = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect("/wizard");
  }

  return (
    <div className="h-full bg-background">
      <div className="bg-card">
        <div className="container flex flex-wrap items-center justify-between gap-6 py-5">
          <h1 className="text-2xl">Hello, {user.firstName}👋</h1>
          <div className="flex items-center gap-2">
            <CreateTransactionDialog
              trigger={
                <Button className="border-emerald-500 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white">
                  Add Income
                </Button>
              }
              type="income"
            />

            <CreateTransactionDialog
              trigger={
                <Button className="border-rose-500 bg-rose-600 text-white hover:bg-rose-700 hover:text-white">
                  Add Expense
                </Button>
              }
              type="expense"
            />
          </div>
        </div>
      </div>
      <OverView userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
};

export default page;
