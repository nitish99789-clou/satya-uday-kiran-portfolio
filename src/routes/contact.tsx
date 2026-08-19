import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Send, Instagram, Youtube, Linkedin, Link2 } from "lucide-react";
import { toast } from "sonner";

import { SiteNav } from "@/components/site/SiteNav";
import { supabase } from "@/integrations/supabase/client";
import { profileQuery, socialLinksQuery } from "@/lib/portfolio";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Let's Create Something Amazing | Uday Kiran" },
      {
        name: "description",
        content:
          "Have a project in mind? Get in touch with Uday Kiran to turn your ideas into cinematic visual stories.",
      },
      { property: "og:title", content: "Contact Uday Kiran" },
      { property: "og:description", content: "Let's collaborate on your next video project." },
    ],
  }),
  component: ContactPage,
});

const socialIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

function ContactPage() {
  const { data: profile } = useQuery(profileQuery);
  const { data: socials = [] } = useQuery(socialLinksQuery);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("contact_messages").insert(form);
    setSending(false);
    if (error) {
      toast.error("Message could not be sent. Please try again.");
      return;
    }
    setForm({ name: "", email: "", message: "" });
    toast.success("Thanks! Your message has been sent.");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SiteNav />

      <main className="relative grid gap-12 px-6 pb-24 pt-4 md:px-12 lg:grid-cols-2">
        <div className="max-w-md">
          <p className="text-sm font-semibold tracking-[0.25em] text-primary">GET IN TOUCH</p>
          <h1 className="mt-4 text-4xl leading-tight font-bold sm:text-5xl">
            {profile?.contact_heading}
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            {profile?.contact_description}
          </p>

          <ul className="mt-9 space-y-5 text-lg">
            <li className="flex items-center gap-4">
              <MapPin className="h-6 w-6 text-primary" />
              <span>{profile?.location}</span>
            </li>
          </ul>

          <p className="mt-10 text-sm font-semibold tracking-[0.25em] text-primary">FOLLOW ME</p>
          <div className="mt-4 flex gap-4">
            {socials.map((s) => {
              const Icon = socialIcons[s.platform.toLowerCase()] ?? Link2;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.platform}
                  className="panel flex h-14 w-14 items-center justify-center rounded-2xl border border-border transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-6 w-6" />
                </a>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="panel relative w-full max-w-xl space-y-5 rounded-3xl border border-border p-6 sm:p-8"
        >
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Your Name"
            className="w-full rounded-2xl border border-border bg-input/40 px-5 py-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Your Email"
            className="w-full rounded-2xl border border-border bg-input/40 px-5 py-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <textarea
            required
            rows={7}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Your Message"
            className="w-full resize-none rounded-2xl border border-border bg-input/40 px-5 py-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary"
          />
          <button
            type="submit"
            disabled={sending}
            className="glow flex w-full items-center justify-center gap-3 rounded-2xl bg-primary px-6 py-4 text-base font-bold tracking-widest text-primary-foreground transition-transform hover:scale-[1.01]"
          >
            {sending ? "SENDING…" : "SEND MESSAGE"} <Send className="h-5 w-5" />
          </button>
        </form>
      </main>

    </div>
  );
}
