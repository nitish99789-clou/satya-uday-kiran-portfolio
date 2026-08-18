import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play } from "lucide-react";

import { SiteNav, MobileNav } from "@/components/site/SiteNav";
import { publishedProjectsQuery, thumbnailsQuery, type Project } from "@/lib/portfolio";
import cameraImage from "@/assets/work-camera.jpg";
import fallback1 from "@/assets/work-1.jpg";
import fallback2 from "@/assets/work-2.jpg";
import fallback3 from "@/assets/work-3.jpg";
import fallback4 from "@/assets/work-4.jpg";

const fallbacks = [fallback1, fallback2, fallback3, fallback4];

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Stories I've Brought to Life | Uday Kiran" },
      {
        name: "description",
        content:
          "Selected video editing work: commercials, music videos, weddings, travel films and short films.",
      },
      { property: "og:title", content: "Work — Uday Kiran, Video Editor" },
      { property: "og:description", content: "A portfolio of cinematic edits and brand promos." },
    ],
  }),
  component: WorkPage,
});

function WorkPage() {
  const { data: projects = [] } = useQuery(publishedProjectsQuery);
  const { data: thumbs = {} } = useQuery(thumbnailsQuery(projects));
  const [filter, setFilter] = useState("ALL");

  const categories = ["ALL", ...Array.from(new Set(projects.map((p) => p.category.toUpperCase())))];
  const visible = projects.filter((p) => filter === "ALL" || p.category.toUpperCase() === filter);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <img
        src={cameraImage}
        alt=""
        aria-hidden="true"
        width={1008}
        height={704}
        loading="lazy"
        className="pointer-events-none absolute -right-10 top-0 hidden w-[46%] opacity-80 lg:block"
      />
      <SiteNav />

      <main className="relative px-6 pb-24 pt-4 md:px-12">
        <p className="text-sm font-semibold tracking-[0.25em] text-primary">MY WORK</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Stories I've Brought to Life
        </h1>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={
                filter === c
                  ? "rounded-full bg-primary px-6 py-2.5 text-sm font-semibold tracking-wider text-primary-foreground"
                  : "rounded-full px-6 py-2.5 text-sm font-semibold tracking-wider text-muted-foreground transition-colors hover:text-primary"
              }
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {visible.map((p, i) => (
            <ProjectCard key={p.id} project={p} image={thumbs[p.id] ?? fallbacks[i % fallbacks.length]} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="mt-16 text-center text-muted-foreground">No projects here yet.</p>
        )}
      </main>

      <MobileNav />
    </div>
  );
}

function ProjectCard({ project, image }: { project: Project; image: string }) {
  const card = (
    <>
      <img
        src={image}
        alt={project.title}
        loading="lazy"
        className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-72"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6">
        <div>
          <h2 className="text-lg font-bold tracking-wide">{project.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{project.subtitle || project.category}</p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <Play className="h-5 w-5 fill-current" />
        </span>
      </div>
    </>
  );

  const className =
    "group relative block overflow-hidden rounded-2xl border border-border bg-card";

  return project.video_url ? (
    <a href={project.video_url} target="_blank" rel="noreferrer" className={className}>
      {card}
    </a>
  ) : (
    <div className={className}>{card}</div>
  );
}
