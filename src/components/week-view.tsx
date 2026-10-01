import {
  addDays,
  formatTime,
  getEventsOn,
  isoOf,
  sortEvents,
  typeClasses,
} from "@/lib/events";

const DAY_HEADERS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function WeekView({ weekStart }: { weekStart: Date }) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const todayIso = isoOf(new Date());

  return (
    <div className="overflow-hidden rounded-2xl bg-foreground/5 ring-1 ring-foreground/10">
      <div className="grid grid-cols-7 border-b border-line/60">
        {days.map((day, i) => {
          const isToday = isoOf(day) === todayIso;
          return (
            <div key={i} className="px-2 py-3 text-center">
              <div
                className={
                  "font-mono text-[10px] tracking-wider " +
                  (isToday ? "text-primary" : "text-muted-foreground")
                }
              >
                {DAY_HEADERS[i]}
              </div>
              <div
                className={
                  "mt-0.5 font-display text-base " +
                  (isToday ? "text-primary" : "text-foreground")
                }
              >
                {day.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-7 divide-x divide-line/40">
        {days.map((day) => {
          const events = sortEvents(getEventsOn(day));
          const isToday = isoOf(day) === todayIso;
          return (
            <div
              key={day.toISOString()}
              className={
                "min-h-56 space-y-1.5 p-1.5 " +
                (isToday ? "bg-primary/5" : "")
              }
            >
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className={"rounded-md p-2 " + typeClasses[ev.type].cell}
                >
                  <div className="text-[11px] font-semibold text-foreground">
                    {ev.title}
                  </div>
                  <div className="font-mono text-[9px] text-fog/70">
                    {ev.allDay ? "All day" : formatTime(ev.time)}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
