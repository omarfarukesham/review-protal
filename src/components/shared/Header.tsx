"use client";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, Moon, MoveRight, Sun, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import deleteTokenFromCookie from "@/Helpers/deleteTokenFromCookie";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { navigationItems } from "../Home/Constants";
import { cn } from "@/lib/utils";

const Header = () => {
  const session = useSession();
  const { setTheme, theme } = useTheme();
  const [isOpen, setOpen] = useState(false);
  
  return (
    <header className="w-full z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link 
              href="/" 
              className="font-semibold playwrite-ro text-2xl md:text-3xl hover:opacity-80 transition-opacity"
            >
              Opinia
            </Link>
            
            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:block">
              <NavigationMenuList className="gap-2">
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.href ? (
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className={cn(
                          "text-sm font-medium transition-colors hover:text-primary",
                          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md px-3 py-2"
                        )}>
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    ) : (
                      <>
                        <NavigationMenuTrigger className="text-sm font-medium data-[state=open]:text-primary px-3 py-2">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="w-[450px] p-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col h-full justify-between">
                              <div className="flex flex-col gap-1">
                                <p className="text-base font-medium">{item.title}</p>
                                <p className="text-muted-foreground text-sm">
                                  {item.description}
                                </p>
                              </div>
                              <Button size="sm" className="mt-6 w-fit">
                                Book a call today
                              </Button>
                            </div>
                          </div>
                        </NavigationMenuContent>
                      </>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="rounded-full hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[120px]">
                <DropdownMenuItem 
                  onClick={() => setTheme("light")}
                  className={cn(theme === "light" && "bg-accent")}
                >
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme("dark")}
                  className={cn(theme === "dark" && "bg-accent")}
                >
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setTheme("system")}
                  className={cn(theme === "system" && "bg-accent")}
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Auth Section */}
            {session.status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-9 w-9 rounded-full hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={session.data.user?.image || "https://github.com/shadcn.png"}
                        alt={session.data.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {(session.data.user?.name || "U").charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {session.data.user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {session.data.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={`/dashboard/${session.data.user?.role.toLowerCase()}/profile`}
                      className="w-full"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await deleteTokenFromCookie();
                      return signOut({ redirect: false });
                    }}
                    className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                  >
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" asChild>
                <Link href="/login" className="whitespace-nowrap">
                  Sign in
                </Link>
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-full hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={() => setOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container px-4 py-3 space-y-4">
            {navigationItems.map((item) => (
              <div key={item.title} className="border-b last:border-b-0 pb-3 last:pb-0">
                {item.href ? (
                  <Link
                    href={item.href}
                    className="flex justify-between items-center py-2 text-base"
                    onClick={() => setOpen(false)}
                  >
                    <span>{item.title}</span>
                    <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                  </Link>
                ) : (
                  <div className="flex flex-col gap-2 py-2">
                    <p className="text-base font-medium">{item.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                    <Button size="sm" className="w-fit mt-2">
                      Book a call today
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;