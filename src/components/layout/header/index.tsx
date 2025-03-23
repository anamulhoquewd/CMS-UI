"use client";

import Image from "next/image";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleUser, LogOut, Menu as MenuIcon, Settings } from "lucide-react";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/theme-switcher";

import logoDark from "@/../public/logo-dark.png";
import logoLight from "@/../public/logo-light.png";
import { useAuth } from "@/store/auth/useAuth";
import { RoleBadge } from "@/components/dashboard/role-badge";
import { useSidebar } from "@/components/ui/sidebar";

export default function Header() {
  const user = useAuth((state) => state.user);
  const { resolvedTheme } = useTheme();

  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <header className="fixed top-0 z-50 p-2 md:py-2 md:px-12 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 order-2 md:order-1">
          <Link href="/" className="flex items-center space-x-2">
            <span className="w-12 sm:w-18 rounded-full flex items-center justify-center">
              <Image
                src={resolvedTheme === "dark" ? logoLight : logoDark}
                alt="Logo"
                width={100}
                height={100}
                className="object-contain"
              />
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center order-2">
          <RoleBadge role={user ? user.role : "user"} />
        </nav>

        {/* Mobile Navigation */}
        {isMobile && (
          <Button
            onClick={() => setOpenMobile(true)}
            variant="ghost"
            size="icon"
            className="order-1"
          >
            <MenuIcon className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}

        {/* Auth Section */}
        <div className="flex items-center gap-4 order-3">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user ? user.avatar : ""} alt="User" />
                  <AvatarFallback>
                    {user
                      ? user.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .toUpperCase()
                      : "JD"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user ? user.name : "John Doe"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user ? user.email : "john.doe@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">
                  <Link className="flex items-center gap-2" href="/me">
                    <CircleUser className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  {/* <Link className="flex items-center gap-2" href="/settings"></Link> */}
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
