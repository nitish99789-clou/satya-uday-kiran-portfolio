import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Send, Menu, X, Home, User, Briefcase, Phone, Instagram, Youtube, Linkedin } from "lucide-react";

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
          <Menu className="h-8 w-8" />
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
        className="absolute inset-0 bg-background/60 backdrop-blur-[2px]"
      />
      <aside className="drawer-in absolute inset-y-0 right-0 flex w-[82%] max-w-sm flex-col overflow-y-auto bg-[oklch(0.13_0.004_60)] px-7 py-6 shadow-[0_0_60px_oklch(0_0_0/0.8)]">
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="self-end text-foreground/80 transition-colors hover:text-primary"
        >
          <X className="h-7 w-7" />
        </button>

        <div className="mt-4 flex items-center gap-4">
          <span className="glow flex h-16 w-16 items-center justify-center rounded-full border border-primary font-display text-2xl font-bold">
            U<span className="text-primary italic">K</span>
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">Uday Kiran</p>
            <p className="truncate text-sm text-muted-foreground">Video Editor &amp; Visual Storyteller</p>
          </div>
        </div>

        <div className="mt-6 h-px w-full bg-primary/30" />

        <nav className="mt-8 flex flex-col gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={onClose}
              activeOptions={{ exact: l.to === "/" }}
              className="flex items-center gap-5 text-lg font-medium tracking-wide text-foreground transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              <l.icon className="h-6 w-6" />
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-10 h-px w-full bg-primary/30" />

        <p className="mt-7 text-sm font-semibold tracking-[0.2em] text-primary">FOLLOW ME</p>
        <div className="mt-4 flex gap-3">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-border transition-colors hover:border-primary hover:text-primary"
            >
              <s.icon className="h-5 w-5" />
            </a>
          ))}
        </div>

        <div className="mt-8 h-px w-full bg-primary/30" />
        <p className="mt-6 pb-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Uday Kiran. All rights reserved.
        </p>
      </aside>
    </div>
  );
}
