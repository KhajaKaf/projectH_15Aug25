"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");

  const [email, setEmail] = useState("arham@kksempire.com");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    router.prefetch("/admin");
  }, [router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        cache: "no-store",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data?.error || "Login failed");
        return;
      }

      toast.success("Welcome, Admin!");
      window.location.href = next || "/admin";
    } catch (err) {
      console.error("login error", err);
      toast.error("Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 pt-16">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-slate-100">Admin Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100"
                placeholder="admin@kksempire.com"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              disabled={busy}
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold"
            >
              {busy ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function LoginClient() {
  return (
    <Suspense fallback={<div className="p-6 text-slate-200">Loading…</div>}>
      <LoginContent />
    </Suspense>
  );
}