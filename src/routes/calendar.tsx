import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { WeekView } from "@/components/week-view";
import {
  addDays,
  eventTypeMeta,
  formatTime,
  getEventsOn,
  getUpcoming,
  isoOf,
  monthDay,
  monthName,
  startOfWeek,
  typeClasses,
  untilLabel,
  weekdayShort,
} from "@/lib/events";

export const Route = createFileRoute("/calendar")({
  component: CalendarPage,
  head: () => ({
    meta: [
      { title: "Calendar — ClearTime" },
      {
        name: "description",
        content:
          "See your month and week of practices, games, study blocks and team events at a glance.",
      },
      { property: "og:title", content: "Calendar — ClearTime" },
      {
        property: "og:description",
        content:
          "See your month and week of practices, games, study blocks and team events at a glance.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const TYPE_ORDER = ["practice", "game", "study", "meeting", "rest"] as const;

function monthMatrix(year: number, month: number): (Date | null)[][] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

function CalendarPage() {
  const now = new Date();
  const [monthOffset, setMonthOffset] = useState(0);
  const [view, setView] = useState<"month" | "week">("month");
  const [weekOffset, setWeekOffset] = useState(0);

  const anchor = addDays(new Date(now.getFullYear(), now.getMonth(), 1), monthOffset * 30);
  const year = anchor.getFullYear();
  const month = anchor.getMonth();
  const weeks = monthMatrix(year, month);
  const todayIso = isoOf(now);

  const weekStart = addDays(startOfWeek(now), weekOffset * 7);

  const upcoming = getUpcoming(6);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="drift absolute -left-32 -top-40 size-[520px] rounded-full bg-study/20 blur-[120px]" />
        <div
          className="drift absolute -right-40 top-1/2 size-[560px] rounded-full bg-practice/20 blur-[130px]"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <SiteNav />

        <div className="flex flex-wrap items-end justify-between gap-4 pt-10">
          <div>
            <div className="mb-2 font-mono text-[11px] tracking-[0.3em] text-primary">
              (A) CALENDAR
            </div>
            <h1 className="font-display text-4xl leading-none tracking-tight text-foreground sm:text-5xl">
              {view === "month"
                ? (monthName(anchor) + " " + year).toUpperCase()
                : "WEEK OF " +
                  (monthName(weekStart) + " " + weekStart.getDate()).toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-foreground/5 p-1 ring-1 ring-foreground/10">
              {(["month", "week"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={
                    "rounded-full px-4 py-2 text-sm capitalize transition-colors " +
                    (view === v
                      ? "bg-primary font-semibold text-primary-foreground"
                      : "font-medium text-fog/80 hover:text-foreground")
                  }
                >
                  {v}
                </button>
              ))}
            </div>
            <button
              onClick={() =>
                view === "month" ? setMonthOffset(monthOffset - 1) : setWeekOffset(weekOffset - 1)
              }
              className="grid size-9 place-items-center rounded-full bg-foreground/5 font-bold text-foreground ring-1 ring-foreground/10 transition-colors hover:bg-foreground/10"
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              onClick={() =>
                view === "month" ? setMonthOffset(0) : setWeekOffset(0)
              }
              className="rounded-full bg-foreground/5 px-4 py-2 font-mono text-[11px] tracking-wider text-foreground ring-1 ring-foreground/10 transition-colors hover:bg-foreground/10"
            >
              TODAY
            </button>
            <button
              onClick={() =>
                view === "month" ? setMonthOffset(monthOffset + 1) : setWeekOffset(weekOffset + 1)
              }
              className="grid size-9 place-items-center rounded-full bg-foreground/5 font-bold text-foreground ring-1 ring-foreground/10 transition-colors hover:bg-foreground/10"
              aria-label="Next"
            >
              ›
            </button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
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

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {view === "month" ? (
              <div className="overflow-hidden rounded-2xl bg-foreground/5 ring-1 ring-foreground/10">
                <div className="grid grid-cols-7 border-b border-line/60">
                  {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((d) => (
                    <div
                      key={d}
                      className="px-2 py-3 text-center font-mono text-[10px] tracking-wider text-muted-foreground"
                    >
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {weeks.flat().map((cell, i) => {
                    if (!cell) {
                      return (
                        <div
                          key={i}
                          className="min-h-28 border-b border-r border-line/40 p-2 last:border-r-0"
                        />
                      );
                    }
                    const events = getEventsOn(cell);
                    const isToday = isoOf(cell) === todayIso;
                    const shown = events.slice(0, 2);
                    const extra = events.length - shown.length;
                    return (
                      <div
                        key={i}
                        className={
                          "min-h-28 space-y-1 border-b border-r border-line/40 p-1.5 last:border-r-0 " +
                          (isToday ? "bg-primary/5" : "")
                        }
                      >
                        <div
                          className={
                            "font-mono text-[10px] " +
                            (isToday ? "font-semibold text-primary" : "text-muted-foreground")
                          }
                        >
                          {cell.getDate()}
                        </div>
                        {shown.map((ev) => (
                          <div
                            key={ev.id}
                            className={"truncate rounded px-1.5 py-0.5 text-[10px] font-medium text-foreground " + typeClasses[ev.type].cell}
                            title={ev.title}
                          >
                            {ev.allDay ? "All day · " : formatTime(ev.time) + " "}
                            {ev.title}
                          </div>
                        ))}
                        {extra > 0 && (
                          <div className="font-mono text-[9px] text-muted-foreground">
                            +{extra} more
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <WeekView weekStart={weekStart} />
            )}
          </div>

          <div className="lg:col-span-4">
            <div className="mb-4 font-mono text-[11px] tracking-[0.3em] text-primary">
              (B) UP NEXT
            </div>
            <div className="space-y-2">
              {upcoming.map(({ event, date }) => (
                <div
                  key={event.id + isoOf(date)}
                  className="flex items-center gap-3 rounded-xl bg-foreground/5 p-3 ring-1 ring-foreground/10"
                >
                  <div
                    className={
                      "grid size-10 shrink-0 place-items-center rounded-lg font-mono text-[10px] text-foreground " +
                      typeClasses[event.type].cell
                    }
                  >
                    {weekdayShort(date)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {event.title}
                    </div>
                    <div className="font-mono text-[10px] text-muted-foreground">
                      {event.allDay
                        ? "All day · " + event.location
                        : formatTime(event.time) + " · " + event.location}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-primary">
                    {untilLabel(event, date)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl bg-foreground/5 p-5 ring-1 ring-foreground/10">
              <div className="font-display text-xl text-foreground">TIP</div>
              <p className="mt-2 text-pretty text-sm text-fog/70">
                Look at Sunday's{" "}
                <Link to="/guide" className="text-primary underline underline-offset-4">
                  plan-the-week block
                </Link>{" "}
                and map the whole week before Monday shows up. Ten minutes there saves
                hours later.
              </p>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    </div>
  );
}
