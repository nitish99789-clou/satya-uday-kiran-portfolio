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
  Download,
} from "lucide-react";

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
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="md:hidden"
        >
          <Menu className="h-7 w-7" />
        </button>
      </div>

      {open && <MobileDrawer onClose={() => setOpen(false)} />}
    </header>
  );
}

function MobileDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-background/70"
      />
      <aside className="drawer-in absolute inset-y-0 right-0 flex w-[62%] max-w-[250px] flex-col overflow-y-auto bg-card px-4 py-4">
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="self-end text-foreground/80 transition-colors hover:text-primary"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="mt-2 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-primary font-display text-xl font-bold">
            U<span className="text-primary italic">K</span>
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">Uday Kiran</p>
            <p className="text-[10px] leading-snug text-muted-foreground">
              Video Editor &amp; Visual Creator
            </p>
          </div>
        </div>

        <div className="mt-3 h-px w-full bg-primary/50" />

        <nav className="mt-2 flex flex-col">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              activeOptions={{ exact: l.to === "/" }}
              className="flex items-center gap-3 py-2.5 text-[12px] font-medium tracking-wide text-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              <l.icon className="h-4 w-4" />
              <span className="flex-1">{l.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </nav>

        <div className="mt-2 h-px w-full bg-primary/50" />

        <p className="mt-4 text-[11px] font-semibold tracking-[0.2em] text-primary">FOLLOW ME</p>
        <div className="mt-2.5 flex gap-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <s.icon className="h-4.5 w-4.5" />
            </a>
          ))}
        </div>

        <div className="mt-4 h-px w-full bg-primary/50" />

        <a
          href="/resume.pdf"
          className="mt-4 flex items-center gap-4 text-[12px] tracking-wide transition-colors hover:text-primary"
        >
          <Download className="h-5 w-5" />
          DOWNLOAD RESUME
        </a>

        <p className="mt-auto pt-10 pb-2 text-center text-[10px] text-muted-foreground">
          © {new Date().getFullYear()} Uday Kiran. All rights reserved.
        </p>
      </aside>
    </div>
  );
}
