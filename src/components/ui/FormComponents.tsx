"use client";
import React from "react";
import { Input } from "./input";
import { usePathname } from "next/navigation";
import Link from "next/link";

const Name = () => {
  const pathName = usePathname();
  const isRegistrationPage = pathName.endsWith("/register");
  return (
    <div className={`${isRegistrationPage ? "block" : "hidden"} grid gap-3`}>
      <label htmlFor="name" className="font-semibold text-sm">
        Name
      </label>
      <Input id="name" type="text" placeholder="jon doe" required />
    </div>
  );
};

export default Name;

export const RedirectUrl = () => {
  const pathName = usePathname();
  const isRegistrationPage = pathName.endsWith("/register");

  return (
    <div className="text-center text-sm">
      {isRegistrationPage
        ? "Already have an account? "
        : "Don't have an account? "}
      <Link
        href={`/${isRegistrationPage ? "login" : "register"}`}
        className="underline underline-offset-4"
      >
        {isRegistrationPage ? "Login" : "Register"}
      </Link>
    </div>
  );
};
