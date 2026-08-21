import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { profileQuery } from "@/lib/portfolio";
import heroImage from "@/assets/hero-setup.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Uday Kiran — Video Editor & Visual Storyteller" },
      {
        name: "description",
        content:
          "Uday Kiran transforms raw footage into cinematic stories — commercials, music videos, short films and travel content.",
      },
      { property: "og:title", content: "Uday Kiran — Video Editor & Visual Storyteller" },
      {
        property: "og:description",
        content: "Uday Kiran transforms raw footage into cinematic stories — commercials, music videos, short films and travel content.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: profile } = useQuery(profileQuery);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SiteNav />

      <main className="relative grid items-center gap-10 px-6 pb-16 pt-6 md:px-12 lg:grid-cols-2 lg:gap-4 lg:pb-24">
        <div className="max-w-xl">
          <p className="text-xl text-muted-foreground md:text-2xl">
            {profile?.hero_intro ?? "Hi, I'm"}{" "}
            <span className="text-primary">{profile?.full_name ?? "Uday Kiran"}</span>
          </p>

          <h1 className="mt-4 font-display text-[2.35rem] leading-[0.95] font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[4.25rem]">
            <span className="text-steel block">{profile?.hero_line1 ?? "VIDEO EDITOR"}</span>
            <span className="mt-1 block lg:whitespace-nowrap">
              <span className="text-steel">&amp; </span>
              <span className="text-primary">{profile?.hero_line2_a ?? "VISUAL"} </span>
              <span className="text-steel">{profile?.hero_line2_b ?? "STORYTELLER"}</span>
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {profile?.hero_description}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to="/work"
              className="glow inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-bold tracking-widest text-primary-foreground transition-transform hover:scale-[1.03]"
            >
              VIEW MY WORK
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/15">
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center rounded-full border border-primary px-7 py-3.5 text-sm font-bold tracking-widest text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              ABOUT ME
            </Link>
          </div>
        </div>

        <div className="relative">
          <img
            src={heroImage}
            alt="Video editing workstation with camera, clapperboard and editing timeline"
            width={1200}
            height={1008}
            className="img-blend w-full object-contain"
          />
        </div>
      </main>

    </div>
  );
}
