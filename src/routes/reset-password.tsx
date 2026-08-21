import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Reset Password — Uday Kiran" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Set a new password for the private admin area." },
      { property: "og:title", content: "Reset Password" },
      { property: "og:description", content: "Set a new password for the private admin area." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast.error("Could not update the password. Request a new reset link.");
      return;
    }
    toast.success("Password updated.");
    navigate({ to: "/admin/dashboard", replace: true });
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-12">

      <div className="relative w-full max-w-md">
        <div className="text-center">
          <p className="font-display text-6xl font-bold tracking-tight">
            U<span className="text-primary italic">K</span>
          </p>
          <h1 className="mt-6 font-display text-4xl font-bold tracking-tight">
            RESET <span className="text-primary">PASSWORD</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {ready
              ? "Choose a new password for your admin account."
              : "Open this page from the reset link in your email."}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="panel mt-8 space-y-4 rounded-3xl border border-primary/40 p-7"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-input/30 px-4 py-3.5 focus-within:border-primary">
            <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <button
              type="button"
              aria-label={show ? "Hide password" : "Show password"}
              onClick={() => setShow((v) => !v)}
              className="shrink-0 text-muted-foreground transition-colors hover:text-primary"
            >
              {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-input/30 px-4 py-3.5 focus-within:border-primary">
            <Lock className="h-5 w-5 shrink-0 text-muted-foreground" />
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={saving || !ready}
            className="glow flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-sm font-bold tracking-widest text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {saving ? "UPDATING…" : "UPDATE PASSWORD"} <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
