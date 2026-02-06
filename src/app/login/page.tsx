"use client";

import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { Database, Loader2 } from "lucide-react";
import Link from "next/link";

function LoginLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 flex items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4">
        <Link href="/" className="flex items-center gap-2 mb-4">
          <Database className="h-10 w-10 text-primary" />
          <span className="text-2xl font-bold">Craig-O-Cache</span>
        </Link>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
