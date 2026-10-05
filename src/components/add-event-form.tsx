import { useEffect, useState } from "react";
import { addEvent, eventTypeMeta, type EventType } from "@/lib/events";

const TYPES = Object.keys(eventTypeMeta) as EventType[];
const field =
  "w-full rounded-lg bg-foreground/5 px-3 py-2 text-sm text-foreground ring-1 ring-foreground/15 outline-none focus:ring-primary";

export function AddEventForm({ date, onDone }: { date: string; onDone: () => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<EventType>("practice");
  const [day, setDay] = useState(date);
  const [time, setTime] = useState("16:00");
  const [endTime, setEndTime] = useState("17:00");
  const [location, setLocation] = useState("");
  const [allDay, setAllDay] = useState(false);

  useEffect(() => setDay(date), [date]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!title.trim() || !day) return;
        addEvent({
          title: title.trim(),
          type,
          date: day,
          time: allDay ? "00:00" : time,
          ...(allDay ? {} : { endTime }),
          location: location.trim() || "—",
          allDay,
        });
        setTitle("");
        setLocation("");
        onDone();
      }}
      className="space-y-3 rounded-2xl bg-foreground/5 p-5 ring-1 ring-foreground/10"
    >
      <div className="font-display text-xl text-foreground">ADD EVENT</div>
      <input className={field} placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus />
      <div className="flex flex-wrap gap-1.5">
        {TYPES.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setType(t)}
            className={
              "rounded-full px-3 py-1 text-xs font-medium ring-1 " +
              (type === t ? "bg-primary text-primary-foreground ring-primary" : "ring-foreground/15 text-fog/80")
            }
          >
            {eventTypeMeta[t].label}
          </button>
        ))}
      </div>
      <input type="date" className={field} value={day} onChange={(e) => setDay(e.target.value)} required />
      <label className="flex items-center gap-2 text-sm text-fog/80">
        <input type="checkbox" checked={allDay} onChange={(e) => setAllDay(e.target.checked)} /> All day
      </label>
      {!allDay && (
        <div className="grid grid-cols-2 gap-2">
          <input type="time" className={field} value={time} onChange={(e) => setTime(e.target.value)} />
          <input type="time" className={field} value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </div>
      )}
      <input className={field} placeholder="Location (optional)" value={location} onChange={(e) => setLocation(e.target.value)} />
      <div className="flex gap-2">
        <button type="submit" className="flex-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Save
        </button>
        <button type="button" onClick={onDone} className="rounded-full px-4 py-2 text-sm text-fog/80 ring-1 ring-foreground/15">
          Cancel
        </button>
      </div>
    </form>
  );
}
