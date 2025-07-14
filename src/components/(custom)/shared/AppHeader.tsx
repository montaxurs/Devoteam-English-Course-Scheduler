"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";

// --- Mode Toggle Component ---
function ModeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}
// --- NavLink Component ---
const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const pathname = usePathname();
    const isActive = pathname === href;
    return (
        <Link href={href} className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground"
        )}>
            {children}
        </Link>
    );
};

// --- Main AppHeader Component ---
export function AppHeader() {
    // const { user } = useUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 max-w-screen-2xl items-center">
                <div className="mr-8 flex items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <Image 
                            src="/English Course Scheduler ico.png" 
                            alt="Devoteam Logo" 
                            width={90} 
                            height={75} 
                            className="rounded-md ml-5"
                        />
                        <span className="hidden font-bold sm:inline-block">
                            English Scheduler
                        </span>
                    </Link>
                </div>
                <nav className="flex items-center gap-6 text-sm">
                    <NavLink href="/dashboard">Dashboard</NavLink>
                    <NavLink href="/my-schedule">My Schedule</NavLink>
                    <NavLink href="/manage-sessions">Manage Sessions</NavLink>
                    <NavLink href="/manage-materials">Manage Materials</NavLink>
                </nav>
                <div className="flex flex-1 items-center justify-end gap-2 mr-5">
                    {/* ModeToggle is placed here */}
                    <ModeToggle />
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>
        </header>
    );
}
