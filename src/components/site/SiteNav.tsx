import { Link } from "@tanstack/react-router";
import { Send } from "lucide-react";

const links = [
  { to: "/", label: "HOME" },
  { to: "/about", label: "ABOUT" },
  { to: "/work", label: "WORK" },
  { to: "/contact", label: "CONTACT" },
] as const;

export function SiteNav() {
  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12">
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

      <Link
        to="/contact"
        className="inline-flex items-center gap-2 rounded-full border border-primary px-5 py-2.5 text-xs font-semibold tracking-widest text-foreground transition-all hover:bg-primary hover:text-primary-foreground md:text-sm"
      >
        LET'S TALK <Send className="h-4 w-4 text-primary transition-colors group-hover:text-primary-foreground" />
      </Link>
    </header>
  );
}

export function MobileNav() {
  return (
    <nav className="flex items-center justify-center gap-6 border-t border-border px-6 py-4 md:hidden">
      {links.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          activeOptions={{ exact: l.to === "/" }}
          className="text-xs font-medium tracking-widest text-muted-foreground data-[status=active]:text-primary"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}
