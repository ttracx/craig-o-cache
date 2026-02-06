"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AuthButtons() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Button variant="ghost" disabled className="gap-2">
        <div className="h-4 w-4 animate-pulse bg-muted rounded" />
        Loading...
      </Button>
    );
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/dashboard">
          <Button variant="ghost" className="gap-2">
            {session.user?.image ? (
              <img src={session.user.image} alt="" className="h-5 w-5 rounded-full" />
            ) : (
              <User className="h-4 w-4" />
            )}
            {session.user?.name?.split(" ")[0] || "Dashboard"}
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <Button variant="ghost">Sign In</Button>
      </Link>
      <Link href="/login?callbackUrl=/dashboard">
        <Button>Get Started</Button>
      </Link>
    </div>
  );
}
