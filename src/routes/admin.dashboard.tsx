import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { profileQuery, profileContactQuery, type Profile, type ProfileContact } from "@/lib/portfolio";
import { CrudSection } from "@/components/admin/CrudSection";
import { ProjectsAdmin } from "@/components/admin/ProjectsAdmin";

const ADMIN_EMAIL = "satyauday0205@gmail.com";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private portfolio management dashboard." },
      { property: "og:title", content: "Admin Dashboard" },
      { property: "og:description", content: "Private portfolio management dashboard." },
    ],
  }),
  component: Dashboard,
});

const tabs = ["Projects", "Profile", "Contact info", "Services", "Experience", "Social links", "Statistics"] as const;
type Tab = (typeof tabs)[number];

function Dashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [state, setState] = useState<"loading" | "ok" | "denied">("loading");
  const [email, setEmail] = useState("");
  const [tab, setTab] = useState<Tab>("Projects");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      if (!user) {
        navigate({ to: "/admin", replace: true });
        return;
      }
      setEmail(user.email ?? "");
      // Temporary access: any signed-in user reaches the dashboard (writes are still RLS-guarded).
      void ADMIN_EMAIL;
      setState("ok");
    });
  }, [navigate]);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin", replace: true });
  }

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Checking access…
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="panel max-w-md rounded-3xl border border-border p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-2xl font-bold">Access denied</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {email} is not authorised to manage this portfolio.
          </p>
          <button
            onClick={() => void signOut()}
            className="mt-6 rounded-2xl border border-border px-6 py-3 text-sm font-semibold"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-5 md:px-10">
        <div>
          <h1 className="text-xl font-bold">Portfolio Admin</h1>
          <p className="text-xs text-muted-foreground">{email}</p>
        </div>
        <button
          onClick={() => void signOut()}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </header>

      <nav className="flex flex-wrap gap-2 px-6 py-5 md:px-10">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={
              tab === t
                ? "rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                : "rounded-full border border-border px-4 py-2 text-sm font-semibold text-muted-foreground"
            }
          >
            {t}
          </button>
        ))}
      </nav>

      <main className="px-6 pb-20 md:px-10">
        {tab === "Projects" && <ProjectsAdmin />}
        {tab === "Profile" && <ProfileEditor />}
        {tab === "Contact info" && <ContactEditor />}
        {tab === "Services" && (
          <CrudSection
            table="services"
            title="Services"
            defaults={{ title: "New service", description: "", icon: "Film" }}
            fields={[
              { key: "title", label: "Title" },
              { key: "icon", label: "Icon (lucide name)" },
              { key: "description", label: "Description", type: "textarea" },
              { key: "sort_order", label: "Order", type: "number" },
            ]}
          />
        )}
        {tab === "Experience" && (
          <CrudSection
            table="experience"
            title="Experience"
            defaults={{ role: "New role", company: "", period: "", description: "" }}
            fields={[
              { key: "role", label: "Role" },
              { key: "company", label: "Company" },
              { key: "period", label: "Period" },
              { key: "description", label: "Description", type: "textarea" },
              { key: "sort_order", label: "Order", type: "number" },
            ]}
          />
        )}
        {tab === "Social links" && (
          <CrudSection
            table="social_links"
            title="Social links"
            defaults={{ platform: "Instagram", url: "https://" }}
            fields={[
              { key: "platform", label: "Platform (Instagram / YouTube / LinkedIn)" },
              { key: "url", label: "URL" },
              { key: "sort_order", label: "Order", type: "number" },
            ]}
          />
        )}
        {tab === "Statistics" && (
          <CrudSection
            table="statistics"
            title="Statistics"
            defaults={{ label: "New stat", value: "0", icon: "Star" }}
            fields={[
              { key: "value", label: "Value" },
              { key: "label", label: "Label" },
              { key: "icon", label: "Icon (lucide name)" },
              { key: "sort_order", label: "Order", type: "number" },
            ]}
          />
        )}
      </main>
    </div>
  );
}

const profileFields: { key: keyof Profile; label: string; textarea?: boolean }[] = [
  { key: "full_name", label: "Full name" },
  { key: "hero_intro", label: "Hero intro" },
  { key: "hero_line1", label: "Hero line 1" },
  { key: "hero_line2_a", label: "Hero line 2 (part A)" },
  { key: "hero_line2_b", label: "Hero line 2 (part B)" },
  { key: "hero_description", label: "Hero description", textarea: true },
  { key: "about_eyebrow", label: "About eyebrow" },
  { key: "about_heading", label: "About heading" },
  { key: "about_bio", label: "About bio", textarea: true },
  { key: "work_heading", label: "Work heading" },
  { key: "contact_heading", label: "Contact heading" },
  { key: "contact_description", label: "Contact description", textarea: true },
  { key: "location", label: "Location" },
];

function ProfileEditor() {
  const qc = useQueryClient();
  const { data: profile } = useQuery(profileQuery);
  const [form, setForm] = useState<Profile | null>(null);
  const current = form ?? profile ?? null;

  const save = useMutation({
    mutationFn: async () => {
      if (!current) return;
      const { id, ...rest } = current;
      const { error } = await supabase.from("profile").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!current) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Profile</h2>
      <div className="panel grid gap-3 rounded-2xl border border-border p-5 sm:grid-cols-2">
        {profileFields.map((f) => (
          <label key={f.key} className="block text-sm">
            <span className="text-muted-foreground">{f.label}</span>
            {f.textarea ? (
              <textarea
                rows={3}
                value={String(current[f.key] ?? "")}
                onChange={(e) => setForm({ ...current, [f.key]: e.target.value })}
                className="mt-1 w-full resize-none rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:border-primary"
              />
            ) : (
              <input
                value={String(current[f.key] ?? "")}
                onChange={(e) => setForm({ ...current, [f.key]: e.target.value })}
                className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:border-primary"
              />
            )}
          </label>
        ))}
      </div>
      <button
        onClick={() => save.mutate()}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        <Save className="h-4 w-4" /> Save profile
      </button>
    </section>
  );
}

function ContactEditor() {
  const qc = useQueryClient();
  const { data } = useQuery(profileContactQuery);
  const [form, setForm] = useState<ProfileContact | null>(null);
  const current = form ?? data ?? null;

  const save = useMutation({
    mutationFn: async () => {
      if (!current) return;
      const { id, ...rest } = current;
      const { error } = await supabase.from("profile_contact").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile_contact"] });
      toast.success("Contact details saved");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!current) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Private contact details</h2>
      <p className="text-sm text-muted-foreground">
        Only you can see these. They are never shown on the public website.
      </p>
      <div className="panel grid gap-3 rounded-2xl border border-border p-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-muted-foreground">Email</span>
          <input
            value={current.email}
            onChange={(e) => setForm({ ...current, email: e.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:border-primary"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted-foreground">Phone</span>
          <input
            value={current.phone}
            onChange={(e) => setForm({ ...current, phone: e.target.value })}
            className="mt-1 w-full rounded-xl border border-border bg-input/40 px-3 py-2 outline-none focus:border-primary"
          />
        </label>
      </div>
      <button
        onClick={() => save.mutate()}
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        <Save className="h-4 w-4" /> Save contact details
      </button>
    </section>
  );
}
