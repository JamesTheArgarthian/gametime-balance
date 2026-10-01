import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteFooter, SiteNav } from "@/components/site-nav";
import { typeClasses } from "@/lib/events";

export const Route = createFileRoute("/guide")({
  component: GuidePage,
  head: () => ({
    meta: [
      { title: "Balance Guide — ClearTime" },
      {
        name: "description",
        content:
          "Practical ways for student athletes to balance training, academics, recovery and travel — and still have a life.",
      },
      { property: "og:title", content: "Balance Guide — ClearTime" },
      {
        property: "og:description",
        content:
          "Practical ways for student athletes to balance training, academics, recovery and travel — and still have a life.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const PRINCIPLES = [
  {
    num: "01",
    color: "text-practice",
    title: "Time-block the day",
    body: "Give every hour a job before the day starts. Class, practice, study and downtime each get a fixed slot, so homework never leaks into the sleep you need to recover.",
    detail: "Start with the immovable blocks — classes and practice — then place study around them, not the other way around.",
  },
  {
    num: "02",
    color: "text-study",
    title: "Schedule recovery like a game",
    body: "Rest is part of training, not a reward for finishing. Put sleep, rest days and light mobility on the calendar with the same weight as a match.",
    detail: "Aim for 8+ hours of sleep and at least one true rest day per week. If a rest day gets cancelled by a rescheduled game, move it — don't delete it.",
  },
  {
    num: "03",
    color: "text-meeting",
    title: "Batch your study sessions",
    body: "Two focused 90-minute blocks beat four distracted hours. Cluster study around practice so classes never pile up on game day.",
    detail: "Match study blocks to your energy: heavy reading after morning classes, lighter review on the bus to an away game.",
  },
  {
    num: "04",
    color: "text-game",
    title: "Plan travel early",
    body: "Road games eat whole days. Map the drive, the missed classes and the homework window a week out, so packed bags and deadlines never fight for the same hours.",
    detail: "Ask professors about away-game dates at the start of the season — most will work with you if you ask before, not after.",
  },
  {
    num: "05",
    color: "text-rest",
    title: "Fuel on a schedule",
    body: "Eat like it's part of practice, because it is. Regular meals and steady hydration keep the afternoon study block from collapsing.",
    detail: "Prep snacks the night before long days. Never leave a game-day meal to whatever the vending machine offers.",
  },
  {
    num: "06",
    color: "text-practice",
    title: "Protect one morning hour",
    body: "Win the first hour of the day. A calm, phone-free start — even 30 minutes — keeps the whole week from tipping over when the schedule gets loud.",
    detail: "Use it for the hardest task, not email. The week's most important work deserves your freshest brain.",
  },
];

const DAY_PLAN = [
  { time: "6:30 AM", label: "Wake + breakfast", type: "rest" as const },
  { time: "8:00 AM – 2:30 PM", label: "Classes", type: "study" as const },
  { time: "3:00 PM – 4:00 PM", label: "Homework sprint #1", type: "study" as const },
  { time: "4:00 PM – 6:00 PM", label: "Practice", type: "practice" as const },
  { time: "6:30 PM", label: "Dinner with the team", type: "meeting" as const },
  { time: "7:30 PM – 9:00 PM", label: "Focused study block", type: "study" as const },
  { time: "9:30 PM", label: "Wind down, screens off", type: "rest" as const },
];

const WEEK_CHECKLIST = [
  "Sunday: map every practice, game and exam for the week",
  "Place two 90-minute study blocks around each practice day",
  "Book at least one full rest day — and defend it",
  "Check next week's travel and tell your professors early",
  "Prep bags, meals and gear the night before",
];

function GuidePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="drift absolute -left-32 -top-40 size-[520px] rounded-full bg-volt/10 blur-[130px]" />
        <div
          className="drift absolute -right-40 top-1/3 size-[560px] rounded-full bg-meeting/15 blur-[120px]"
          style={{ animationDelay: "-3s" }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-10 sm:px-8">
        <SiteNav />

        <section className="rise pt-10">
          <div className="mb-4 font-mono text-[11px] tracking-[0.3em] text-primary">
            (A) BALANCE GUIDE
          </div>
          <h1 className="max-w-[24ch] font-display text-[clamp(2.4rem,5.5vw,4.2rem)] leading-[0.95] tracking-tight text-balance text-foreground">
            Win the week <span className="text-primary">before it starts.</span>
          </h1>
          <p className="mt-5 max-w-[56ch] text-pretty text-fog/75">
            You can't add hours to the day — you can only decide where they go. These six
            moves keep training, grades and recovery from colliding, and they all start
            with one habit: putting the week on the calendar before the week happens.
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-4 font-mono text-[11px] tracking-[0.3em] text-primary">
            (B) SIX PRINCIPLES
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p) => (
              <div
                key={p.num}
                className="rounded-2xl bg-foreground/5 p-5 ring-1 ring-foreground/10"
              >
                <div className={"font-display text-4xl leading-none " + p.color}>
                  {p.num}
                </div>
                <div className="mt-3 font-semibold text-foreground">{p.title}</div>
                <p className="mt-2 text-pretty text-sm text-fog/70">{p.body}</p>
                <p className="mt-3 border-t border-line/60 pt-3 text-pretty text-xs text-muted-foreground">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="mb-4 font-mono text-[11px] tracking-[0.3em] text-primary">
              (C) A PRACTICE DAY, BLOCKED
            </div>
            <div className="overflow-hidden rounded-2xl bg-foreground/5 ring-1 ring-foreground/10">
              {DAY_PLAN.map((slot, i) => (
                <div
                  key={slot.time}
                  className={
                    "flex items-center gap-4 p-4 " +
                    (i > 0 ? "border-t border-line/60" : "")
                  }
                >
                  <div className="w-40 shrink-0 font-mono text-[11px] tracking-wider text-muted-foreground">
                    {slot.time.toUpperCase()}
                  </div>
                  <div
                    className={
                      "flex-1 rounded-lg px-3 py-2 text-sm font-medium text-foreground " +
                      typeClasses[slot.type].cell
                    }
                  >
                    {slot.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="mb-4 font-mono text-[11px] tracking-[0.3em] text-primary">
              (D) SUNDAY CHECKLIST
            </div>
            <div className="rounded-2xl bg-foreground/5 p-5 ring-1 ring-foreground/10">
              <ol className="space-y-3">
                {WEEK_CHECKLIST.map((item, i) => (
                  <li key={item} className="flex gap-3 text-sm text-fog/80">
                    <span className="font-mono text-[11px] leading-5 text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ol>
              <Link
                to="/calendar"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Open the calendar →
              </Link>
            </div>
          </div>
        </section>

        <SiteFooter />
      </div>
    </div>
  );
}
