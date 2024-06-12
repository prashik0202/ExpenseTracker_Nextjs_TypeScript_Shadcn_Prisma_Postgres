import React from "react";
import { HandCoins } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href={"/"} className="flex gap-x-2 items-center">
      <HandCoins className="h-10 w-10 " />
      <h1 className="text-4xl">ExpenMoney</h1>
    </Link>
  );
};

export function NavbarIcon() {
  return (
    <Link href={"/"} className="flex gap-x-2 items-center">
      <HandCoins className="h-5 w-5 " />
      <h1 className="text-xl">ExpenMoney</h1>
    </Link>
  );
}

export function LogoMobile() {
  return (
    <a href="/" className="flex items-center gap-2">
      <p className="text-xl">ExpenMoney</p>
    </a>
  );
}

export default Logo;
