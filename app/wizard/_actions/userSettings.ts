"use server";

import prisma from "@/lib/prisma";
import { UpdateUserCurrencySettings } from "@/schema/userSettings";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function UpdateUserCurrency(currency: string) {
  const parsedBody = UpdateUserCurrencySettings.safeParse({ currency });

  if (!parsedBody.success) {
    throw parsedBody.error;
  }

  const user = await currentUser();
  if (!user?.id) {
    redirect("/sign-in");
  }

  const userSettings = await prisma.userSettings.update({
    where: {
      userId: user.id,
    },
    data: {
      currency,
    },
  });

  return userSettings;
}
