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
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-xl border border-border bg-background/90 backdrop-blur-md shadow-md w-[95%] max-w-4xl">
      <nav className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="SmartSplit Logo"
            width={85}
            height={20}
            className="object-contain invert dark:invert-0"
            priority
          />
        </Link>

        {/* Nav Links */}
        {path === "/" && (
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground">
            <Link
              href="#features"
              className="hover:text-primary transition-colors"
            >
              Why SmartSplit
            </Link>
            <Link
              href="#how-it-works"
              className="hover:text-primary transition-colors"
            >
              Track Your Spending
            </Link>
          </div>
        )}

        {/* Auth Buttons / Dashboard */}
        <div className="flex items-center gap-2">
          <Authenticated>
            <Link href="/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2 text-foreground hover:text-primary"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button variant="ghost" className="md:hidden w-10 h-10 p-0">
                <LayoutDashboard className="h-4 w-4" />
              </Button>
            </Link>
            <UserButton />
          </Authenticated>

          <Unauthenticated>
            <SignInButton>
              <Button variant="outline" className="text-foreground hover:text-primary ">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button className="bg-primary text-primary-foreground hover:brightness-110 transition">
                Get Started
              </Button>
            </SignUpButton>
          </Unauthenticated>
        </div>
      </nav>

      {/* Loading Bar */}
      {isLoading && <BarLoader width="100%" color="#00d883" />}
    </header>
  );
};

export default Header;
