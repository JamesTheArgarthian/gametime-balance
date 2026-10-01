import { Link, useLocation } from "@tanstack/react-router";
import { monthName } from "@/lib/events";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/calendar", label: "Calendar" },
  { to: "/guide", label: "Guide" },
] as const;

export function SiteNav() {
  const pathname = useLocation({ select: (s) => s.pathname });

  return (
    <header className="border-b border-line/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-lg bg-primary font-display text-lg leading-none text-primary-foreground">
            C
          </div>
          <div className="leading-none">
            <div className="font-display text-xl tracking-wide text-foreground">
              CLEARTIME
            </div>
            <div className="mt-1 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
              STUDENT ATHLETE OS
            </div>
          </div>
        </Link>

        <nav className="flex items-center gap-1 rounded-full bg-foreground/5 p-1 ring-1 ring-foreground/10">
          {NAV_LINKS.map((link) => {
            const active =
              link.to === "/" ? pathname === "/" : pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={
                  "rounded-full px-4 py-2 text-sm transition-colors " +
                  (active
                    ? "bg-primary font-semibold text-primary-foreground"
                    : "font-medium text-fog/80 hover:text-foreground")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="font-mono text-[11px] tracking-wider text-muted-foreground">
            {monthName(new Date()).toUpperCase()} · SEASON
          </div>
          <div className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-volt to-practice font-display text-sm text-primary-foreground">
            J
          </div>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-4 flex items-center justify-between border-t border-line/60 py-6">
      <div className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
        CLEARTIME · BUILT FOR THE GAME
      </div>
      <div className="font-mono text-[10px] text-muted-foreground">STAY READY</div>
    </footer>
  );
}
