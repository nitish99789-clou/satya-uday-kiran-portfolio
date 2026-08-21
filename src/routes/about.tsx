import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import * as Icons from "lucide-react";

import { SiteNav } from "@/components/site/SiteNav";
import { profileQuery, statisticsQuery, servicesQuery, experienceQuery } from "@/lib/portfolio";
import aboutImage from "@/assets/about-studio.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Uday Kiran — Crafting Emotion Through Every Frame" },
      {
        name: "description",
        content:
          "Passionate video editor helping brands, creators and businesses bring ideas to life through cinematic visuals.",
      },
      { property: "og:title", content: "About Uday Kiran — Video Editor" },
      {
        property: "og:description",
        content: "3+ years of experience, 150+ projects and a love for cinematic storytelling.",
      },
    ],
  }),
  component: AboutPage,
});

function LucideIcon({ name, className }: { name: string; className?: string }) {
  const Cmp = (Icons as unknown as Record<string, Icons.LucideIcon>)[name] ?? Icons.Star;
  return <Cmp className={className} />;
}

function AboutPage() {
  const { data: profile } = useQuery(profileQuery);
  const { data: stats = [] } = useQuery(statisticsQuery);
  const { data: services = [] } = useQuery(servicesQuery);
  const { data: experience = [] } = useQuery(experienceQuery);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <SiteNav />

      <main className="relative grid gap-12 px-6 pb-20 pt-6 md:px-12 lg:grid-cols-2 lg:items-center">
        <div className="max-w-xl">
          <p className="text-sm font-semibold tracking-[0.25em] text-primary">
            {profile?.about_eyebrow ?? "WHO I AM"}
          </p>
          <h1 className="mt-4 text-4xl leading-tight font-bold sm:text-5xl">
            {profile?.about_heading}
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            {profile?.about_bio}
          </p>

          <ul className="panel mt-8 max-w-md space-y-4 rounded-2xl border border-border p-6">
            {stats.map((s) => (
              <li key={s.id} className="flex items-center gap-4">
                <LucideIcon name={s.icon} className="h-6 w-6 shrink-0 text-primary" />
                <span className="text-lg">
                  {s.value} {s.label}
                </span>
              </li>
            ))}
          </ul>

          <p className="font-script mt-8 text-4xl text-primary">{profile?.full_name}</p>
        </div>

        <div className="relative hidden lg:block">
          <img
            src={aboutImage}
            alt="Cinematic editing studio with three monitors and neon sign"
            width={1104}
            height={1104}
            loading="lazy"
            className="img-blend w-full object-contain"
          />
        </div>
      </main>

      <section className="relative px-6 pb-20 md:px-12">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">What I Do</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <article key={s.id} className="panel rounded-2xl border border-border p-6">
              <LucideIcon name={s.icon} className="h-7 w-7 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative px-6 pb-24 md:px-12">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Experience</h2>
        <ol className="mt-6 space-y-4">
          {experience.map((e) => (
            <li
              key={e.id}
              className="panel rounded-2xl border border-border p-6 sm:flex sm:items-start sm:justify-between sm:gap-8"
            >
              <div>
                <h3 className="text-lg font-semibold">
                  {e.role} <span className="text-primary">· {e.company}</span>
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {e.description}
                </p>
              </div>
              <p className="mt-3 shrink-0 text-sm tracking-widest text-muted-foreground sm:mt-1">
                {e.period}
              </p>
            </li>
          ))}
        </ol>
      </section>

    </div>
  );
}
