// clerk imports
import { currentUser } from "@clerk/nextjs/server";
// next imports
import { redirect } from "next/navigation";
import Link from "next/link";

// shadcn imports
import { Info } from "lucide-react";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Components
import { CurrencyComboBox } from "@/components/CurrencyComboBox";
import Logo from "@/components/Logo";

const WizardPage = async () => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container flex max-w-2xl flex-col items-center justify-between gap-4">
      <h1 className="text-2xl text-center">Welcome, {user.firstName}!👋</h1>
      <h2 className="text-sm text-center">
        Let's get started by setting your currency
      </h2>
      <h3 className="text-xs text-center text-orange-500 flex gap-x-2">
        <Info className="w-4 h-4" />
        You can change this settings any time
      </h3>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Currency</CardTitle>
          <CardDescription>Select your default currency</CardDescription>
        </CardHeader>
        <CardContent>
          <CurrencyComboBox />
        </CardContent>
      </Card>
      <Button asChild className="w-full">
        <Link href={"/"}>I'm done! take me to dashboard</Link>
      </Button>

      <div className="mt-10">
        <Logo />
      </div>
    </div>
  );
};

export default WizardPage;
