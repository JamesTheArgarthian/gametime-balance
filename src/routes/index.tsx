import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { WeekView } from "@/components/week-view";
import { RemoveTrigger } from "@/components/event-actions";
import {
  activeOrNextEvent,
  useEventsVersion,
  eventTypeMeta,
  formatTime,
  getUpcoming,
  monthDay,
  startOfWeek,
  typeClasses,
  untilLabel,
  weekdayShort,
} from "@/lib/events";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ClearTime — Own Your Schedule" },
      {
        name: "description",
        content:
          "Practice, games, study and rest in one place. A time planner built for student athletes.",
      },
      { property: "og:title", content: "ClearTime — Own Your Schedule" },
      {
        property: "og:description",
        content:
          "Practice, games, study and rest in one place. A time planner built for student athletes.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const TYPE_ORDER = ["practice", "game", "study", "meeting", "rest"] as const;

const GUIDE_TEASERS = [
  {
    num: "01",
    color: "text-practice",
    title: "Time-block the day",
    body: "Give every hour a job. Practice, class, and recovery each get a fixed slot — no drifting.",
  },
  {
    num: "02",
    color: "text-study",
    title: "Schedule recovery",
    body: "Rest is a rep, not a reward. Book sleep and rest days like you book a game.",
  },
  {
    num: "03",
    color: "text-meeting",
    title: "Plan travel ahead",
    body: "Road games eat hours. Block the drive early so study time never gets crushed.",
  },
  {
    num: "04",
    color: "text-game",
    title: "Protect the morning",
    body: "Win the first hour. A calm start keeps the whole week from tipping over.",
  },
];

function Index() {
  useEventsVersion();
  const weekStart = startOfWeek(new Date());
  const upcoming = getUpcoming(5);
  const focus = activeOrNextEvent();

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="drift absolute -left-32 -top-40 size-[520px] rounded-full bg-practice/25 blur-[120px]" />
        <div
          className="drift absolute -right-40 top-1/3 size-[560px] rounded-full bg-volt/15 blur-[130px]"
          style={{ animationDelay: "-3s" }}
        />
        <div
          className="drift absolute bottom-0 left-1/4 size-[420px] rounded-full bg-game/15 blur-[120px]"
          style={{ animationDelay: "-6s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8">
        <SiteNav />

        <section className="grid gap-6 pb-8 pt-10 lg:grid-cols-12">
          <div className="rise lg:col-span-7">
            <div className="mb-4 font-mono text-[11px] tracking-[0.3em] text-primary">
              (A) THIS WEEK
            </div>
            <h1 className="font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[0.92] tracking-tight text-balance text-foreground">
              Every rep has a place. <span className="text-primary">Pack it.</span>
            </h1>
            <p className="mt-5 max-w-[46ch] text-pretty text-fog/75">
              Your week, sorted like a gym bag before practice. Games, study, recovery —
              each block in its slot, ready before the whistle.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {TYPE_ORDER.map((type) => (
                <span
                  key={type}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1.5 text-xs font-medium ring-1 ring-foreground/10"
                >
                  <span className={"size-2.5 rounded-full " + typeClasses[type].dot} />
                  {eventTypeMeta[type].label}
                </span>
              ))}
            </div>
          </div>

          <div className="rise lg:col-span-5" style={{ animationDelay: "120ms" }}>
            <div className="relative overflow-hidden rounded-2xl bg-foreground/5 p-5 ring-1 ring-foreground/10">
              <div className="pointer-events-none absolute inset-0">
                <div className="sweep absolute bottom-0 top-0 w-1/3 bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
              </div>
              <div className="relative flex items-center justify-between">
                <div className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
                  NEXT UP
                </div>
                {focus && (
                  <div className="font-mono text-[11px] text-primary">
                    {focus.progress !== null
                      ? "IN SESSION"
                      : untilLabel(focus.event, focus.date)}
                  </div>
                )}
              </div>
              {focus ? (
                <div className="relative mt-4">
                  <div className="font-display text-3xl leading-none text-foreground">
                    {focus.event.title}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-sm text-fog/80">
                    <span className={"size-2 rounded-full " + typeClasses[focus.event.type].dot} />
                    {focus.event.allDay
                      ? "All day · " + focus.event.location
                      : formatTime(focus.event.time) + " · " + focus.event.location}
                  </div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <div
                      className={"h-full rounded-full " + typeClasses[focus.event.type].dot}
                      style={{ width: Math.round((focus.progress ?? 0) * 100) + "%" }}
                    />
                  </div>
                  <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                    <span>
                      {focus.event.allDay
                        ? "ALL DAY"
                        : (focus.event.endTime
                            ? formatTime(focus.event.time) + " – " + formatTime(focus.event.endTime)
                            : formatTime(focus.event.time)
                          ).toUpperCase()}
                    </span>
                    <span>
                      {focus.progress !== null
                        ? Math.round(focus.progress * 100) + "% DONE"
                        : weekdayShort(focus.date) + " " + monthDay(focus.date)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative mt-4 font-display text-3xl leading-none text-foreground">
                  All clear
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-6 pb-10 lg:grid-cols-12">
          <div className="rise lg:col-span-8" style={{ animationDelay: "200ms" }}>
            <div className="mb-4 flex items-end justify-between">
              <div className="font-mono text-[11px] tracking-[0.3em] text-primary">
                (B) WEEK VIEW
              </div>
              <Link
                to="/calendar"
                className="font-mono text-[11px] text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                FULL CALENDAR →
              </Link>
            </div>
            <WeekView weekStart={weekStart} />
          </div>

          <div className="rise lg:col-span-4" style={{ animationDelay: "280ms" }}>
            <div className="mb-4 font-mono text-[11px] tracking-[0.3em] text-primary">
              (C) UP NEXT
            </div>
            <div className="space-y-2">
              {upcoming.map(({ event, date }) => (
                <div
                  key={event.id + isoKey(date)}
                  className="flex items-center gap-3 rounded-xl bg-foreground/5 p-3 ring-1 ring-foreground/10"
                >
                  <div
                    className={
                      "grid size-10 place-items-center rounded-lg font-mono text-[10px] text-foreground " +
                      typeClasses[event.type].cell
                    }
                  >
                    {weekdayShort(date)}
                  </div>
                  <div className="flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {event.title}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {event.allDay
                        ? "All day · " + event.location
                        : formatTime(event.time) + " · " + event.location}
                    </div>
                  </div>
                  <RemoveTrigger
                    id={event.id}
                    date={date}
                    ariaLabel={"Remove " + event.title}
                    className="px-1 text-muted-foreground transition-colors hover:text-destructive"
                  >
                    ×
                  </RemoveTrigger>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mb-4 font-mono text-[11px] tracking-[0.3em] text-primary">
            (D) BALANCE GUIDE
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDE_TEASERS.map((tip, i) => (
              <Link
                key={tip.num}
                to="/guide"
                className="rise rounded-2xl bg-foreground/5 p-5 ring-1 ring-foreground/10 transition-colors hover:bg-foreground/10"
                style={{ animationDelay: 320 + i * 60 + "ms" }}
              >
                <div className={"font-display text-4xl leading-none " + tip.color}>
                  {tip.num}
                </div>
                <div className="mt-3 font-semibold text-foreground">{tip.title}</div>
                <p className="mt-2 text-pretty text-sm text-fog/70">{tip.body}</p>
              </Link>
            ))}
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}

function isoKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}
