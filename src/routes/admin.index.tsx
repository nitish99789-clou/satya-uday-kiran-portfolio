import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogIn, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Sign In" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private administration area." },
      { property: "og:title", content: "Admin Sign In" },
      { property: "og:description", content: "Private administration area." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/admin/dashboard", replace: true });
    });
  }, [navigate]);

  async function signIn() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/admin`,
      extraParams: { prompt: "select_account" },
    });
    if (result.error) {
      setLoading(false);
      toast.error("Sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin/dashboard", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="panel w-full max-w-md rounded-3xl border border-border p-8 text-center">
        <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
        <h1 className="mt-5 text-2xl font-bold">Admin Access</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This area is private. Sign in with the owner Google account to manage the portfolio.
        </p>
        <button
          onClick={signIn}
          disabled={loading}
          className="glow mt-8 inline-flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-sm font-bold tracking-widest text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          <LogIn className="h-5 w-5" />
          {loading ? "CONNECTING…" : "CONTINUE WITH GOOGLE"}
        </button>
      </div>
    </div>
  );
}
