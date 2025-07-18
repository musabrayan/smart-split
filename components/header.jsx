"use client";

import { useStoreUserEffect } from "@/hooks/use-store-user";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";

const Header = () => {
  const { isLoading } = useStoreUserEffect();
  const path = usePathname();

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[90%] max-w-6xl rounded-full border border-border bg-background/20 backdrop-blur-md shadow-md">
  <nav className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 md:px-6">
    
    {/* Logo */}
    <Link href="/" className="flex items-center gap-2 shrink-0">
      <Image
        src="/assets/logo.png"
        alt="SmartSplit Logo"
        width={85}
        height={20}
        className="object-contain invert dark:invert-0"
        priority
      />
    </Link>

    {/* Nav Links (Only on Home Page, desktop only) */}
   {path === "/" && (
  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 text-sm font-medium text-foreground">
    <Link href="#features" className="hover:text-primary transition-colors">
      Why SmartSplit
    </Link>
    <Link href="#how-it-works" className="hover:text-primary transition-colors">
      Track Your Spending
    </Link>
  </div>
)}

    {/* Auth Buttons / Dashboard */}
    <div className="flex items-center gap-2 ml-auto shrink-0">
      <Authenticated>
        <Link href="/dashboard" className="flex items-center gap-2">
          {/* Desktop Button */}
          <Button
            variant="outline"
            className="hidden md:inline-flex items-center gap-2 text-sm h-8 px-3 text-foreground hover:text-primary hover:cursor-pointer"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Button>

          {/* Mobile Icon */}
          <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
            <LayoutDashboard className="h-4 w-4" />
          </Button>
        </Link>
        <UserButton />
      </Authenticated>

      <Unauthenticated>
        <SignInButton>
          <Button
            variant="outline"
            className="text-sm h-8 px-3 py-3 text-foreground hover:text-primary rounded-full hover:cursor-pointer"
          >
            Sign In
          </Button>
        </SignInButton>
        <SignUpButton>
          <Button
            className="text-sm h-8 px-3 py-3 bg-primary text-primary-foreground hover:brightness-110 transition rounded-full hover:cursor-pointer"
          >
            Get Started
          </Button>
        </SignUpButton>
      </Unauthenticated>
    </div>
  </nav>

  {/* Loading Bar */}
  {isLoading && (
  <div className="px-10">
    <BarLoader width="100%" color="#00d883" />
  </div>
)}
</header>

  );
};

export default Header;