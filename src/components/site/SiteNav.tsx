import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Send,
  Menu,
  X,
  Home,
  User,
  Briefcase,
  Phone,
  Instagram,
  Youtube,
  Linkedin,
  ChevronRight,
  Sun,
  Moon,
  Download,
} from "lucide-react";

import { useTheme } from "@/components/site/theme";

const links = [
  { to: "/", label: "HOME", icon: Home },
  { to: "/about", label: "ABOUT", icon: User },
  { to: "/work", label: "WORK", icon: Briefcase },
  { to: "/contact", label: "CONTACT", icon: Phone },
] as const;

const socials = [
  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
  { href: "https://youtube.com", label: "YouTube", icon: Youtube },
  { href: "https://linkedin.com", label: "LinkedIn", icon: Linkedin },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="relative z-40 flex items-center justify-between px-6 py-6 md:px-12">
      <Link to="/" className="font-display text-4xl font-bold tracking-tight">
        U<span className="text-primary italic">K</span>
      </Link>

      <nav className="hidden items-center gap-8 md:flex lg:gap-12">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: l.to === "/" }}
            className="group relative text-sm font-medium tracking-widest text-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
          >
            {l.label}
            <span className="absolute -bottom-3 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary opacity-0 transition-opacity group-data-[status=active]:opacity-100" />
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 rounded-full border border-primary px-4 py-2.5 text-xs font-semibold tracking-widest text-foreground transition-all hover:bg-primary hover:text-primary-foreground md:text-sm"
        >
          LET'S TALK <Send className="h-4 w-4 text-primary" />
        </Link>
        <button
          type="button"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          onClick={toggle}
          className="hidden text-foreground transition-colors hover:text-primary md:inline-flex"
        >
          {theme === "dark" ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </button>
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="md:hidden"
        >
          <Menu className="h-8 w-8" />
        </button>
      </div>

      {open && <MobileDrawer onClose={() => setOpen(false)} />}
    </header>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  const { theme, toggle } = useTheme();
  const dark = theme === "dark";

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-background/70"
      />
      <aside className="drawer-in absolute inset-y-0 right-0 flex w-[78%] max-w-sm flex-col overflow-y-auto bg-card px-6 py-5">
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="self-end text-foreground/80 transition-colors hover:text-primary"
        >
          <X className="h-7 w-7" />
        </button>

        <div className="mt-3 flex items-center gap-4">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-2 border-primary font-display text-2xl font-bold">
            U<span className="text-primary italic">K</span>
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">Uday Kiran</p>
            <p className="truncate text-sm text-muted-foreground">Video Editor &amp; Visual Creator</p>
          </div>
        </div>

        <div className="mt-5 h-px w-full bg-primary/50" />

        <nav className="mt-5 flex flex-col">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              activeOptions={{ exact: l.to === "/" }}
              className="flex items-center gap-5 py-4 text-base font-medium tracking-wide text-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              <l.icon className="h-6 w-6" />
              <span className="flex-1">{l.label}</span>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </nav>

        <div className="mt-3 h-px w-full bg-primary/50" />

        <p className="mt-6 text-sm font-semibold tracking-[0.2em] text-primary">FOLLOW ME</p>
        <div className="mt-4 flex gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <s.icon className="h-6 w-6" />
            </a>
          ))}
        </div>

        <div className="mt-6 h-px w-full bg-primary/50" />

        <button
          type="button"
          onClick={toggle}
          className="mt-6 flex w-full items-center gap-5 text-base tracking-wide"
        >
          {dark ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
          <span className="flex-1 text-left">{dark ? "DARK MODE" : "LIGHT MODE"}</span>
          <span
            aria-hidden="true"
            className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
              dark ? "bg-primary" : "bg-muted"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-background transition-transform ${
                dark ? "translate-x-6" : ""
              }`}
            />
          </span>
        </button>

        <a
          href="/resume.pdf"
          className="mt-7 flex items-center gap-5 text-base tracking-wide transition-colors hover:text-primary"
        >
          <Download className="h-6 w-6" />
          DOWNLOAD RESUME
        </a>

        <p className="mt-auto pt-10 pb-2 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Uday Kiran. All rights reserved.
        </p>
      </aside>
    </div>
  );
}
