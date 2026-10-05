export type EventType = "practice" | "game" | "study" | "meeting" | "rest";

export const eventTypeMeta: Record<EventType, { label: string }> = {
  practice: { label: "Practice" },
  game: { label: "Game" },
  study: { label: "Study" },
  meeting: { label: "Meeting" },
  rest: { label: "Rest" },
};

export interface CalEvent {
  id: string;
  title: string;
  type: EventType;
  /** "HH:MM" 24h */
  time: string;
  endTime?: string;
  location: string;
  allDay?: boolean;
  /** 0 = Sunday … 6 = Saturday, for recurring weekly events */
  weekday?: number;
  /** ISO yyyy-mm-dd, for one-off events */
  date?: string;
}

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "cleartime-events";
let oneOffs: CalEvent[] = [];
let version = 0;
let loaded = false;
const listeners = new Set<() => void>();
const recurring: CalEvent[] = [];

function emit() {
  version++;
  listeners.forEach((l) => l());
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) oneOffs = JSON.parse(raw);
  } catch {
    oneOffs = [];
  }
  emit();
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(oneOffs));
  emit();
}

export function addEvent(ev: Omit<CalEvent, "id">) {
  oneOffs = [...oneOffs, { ...ev, id: crypto.randomUUID() }];
  save();
}

export function deleteEvent(id: string) {
  oneOffs = oneOffs.filter((e) => e.id !== id);
  save();
}

/** Re-renders the caller whenever events change. */
export function useEventsVersion(): number {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      queueMicrotask(load);
      return () => listeners.delete(cb);
    },
    () => version,
    () => 0,
  );
}

export function addDays(d: Date, n: number): Date {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  c.setDate(c.getDate() + n);
  return c;
}

export function isoOf(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

export function startOfWeek(d: Date): Date {
  const c = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  return addDays(c, -((c.getDay() + 6) % 7));
}

export function minutesOfDay(t: string): number {
  const [h = 0, m = 0] = t.split(":").map(Number);
  return h * 60 + m;
}

export function formatTime(t: string): string {
  const [h = 0, m = 0] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function sortEvents(events: CalEvent[]): CalEvent[] {
  return [...events].sort((a, b) => {
    if (a.allDay && !b.allDay) return -1;
    if (!a.allDay && b.allDay) return 1;
    return minutesOfDay(a.time) - minutesOfDay(b.time);
  });
}

export function getEventsOn(date: Date): CalEvent[] {
  const iso = isoOf(date);
  const wd = date.getDay();
  return [
    ...recurring.filter((e) => e.weekday === wd),
    ...oneOffs.filter((e) => e.date === iso),
  ];
}

export interface UpcomingItem {
  event: CalEvent;
  date: Date;
}

export function getUpcoming(count: number): UpcomingItem[] {
  const out: UpcomingItem[] = [];
  const base = new Date();
  const nowMins = base.getHours() * 60 + base.getMinutes();
  for (let off = 0; off < 21 && out.length < count; off++) {
    const day = addDays(base, off);
    for (const ev of sortEvents(getEventsOn(day))) {
      if (off === 0) {
        const end = minutesOfDay(ev.endTime ?? ev.time) + 30;
        if (end < nowMins) continue;
      }
      out.push({ event: ev, date: day });
      if (out.length >= count) break;
    }
  }
  return out;
}

export interface FocusEvent {
  event: CalEvent;
  date: Date;
  /** 0–1 when the event is happening right now, null when upcoming */
  progress: number | null;
}

export function activeOrNextEvent(): FocusEvent | null {
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (let off = 0; off < 8; off++) {
    const day = addDays(now, off);
    for (const ev of sortEvents(getEventsOn(day))) {
      if (ev.allDay) continue;
      const start = minutesOfDay(ev.time);
      const end = minutesOfDay(ev.endTime ?? ev.time) + 30;
      if (off === 0 && nowMins >= start && nowMins < end) {
        return { event: ev, date: day, progress: (nowMins - start) / (end - start) };
      }
      if (off > 0 || nowMins < start) {
        return { event: ev, date: day, progress: null };
      }
    }
  }
  return null;
}

export function untilLabel(event: CalEvent, date: Date): string {
  const now = new Date();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (!event.allDay) {
    const [h = 0, m = 0] = event.time.split(":").map(Number);
    target.setHours(h, m, 0, 0);
  }
  const diffMin = Math.round((target.getTime() - now.getTime()) / 60000);
  if (diffMin <= 0) return "NOW";
  if (diffMin < 60) return `IN ${diffMin} MIN`;
  if (diffMin < 24 * 60) {
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return `IN ${h}H${m ? ` ${m}M` : ""}`;
  }
  const days = Math.round(diffMin / (24 * 60));
  if (days === 1) return "TOMORROW";
  return `IN ${days} DAYS`;
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function weekdayShort(d: Date): string {
  return WEEKDAYS[d.getDay()] ?? "";
}

export function monthDay(d: Date): string {
  return String(d.getDate());
}

export function monthName(d: Date): string {
  return MONTHS[d.getMonth()] ?? "";
}

/** Literal class strings so Tailwind picks them up at build time. */
export const typeClasses: Record<
  EventType,
  { cell: string; chip: string; dot: string; strong: string }
> = {
  practice: {
    cell: "bg-practice/20 ring-1 ring-practice/40",
    chip: "bg-practice/15 text-practice ring-1 ring-practice/40",
    dot: "bg-practice",
    strong: "text-practice",
  },
  game: {
    cell: "bg-game/25 ring-1 ring-game/50",
    chip: "bg-game/15 text-game ring-1 ring-game/40",
    dot: "bg-game",
    strong: "text-game",
  },
  study: {
    cell: "bg-study/20 ring-1 ring-study/40",
    chip: "bg-study/15 text-study ring-1 ring-study/40",
    dot: "bg-study",
    strong: "text-study",
  },
  meeting: {
    cell: "bg-meeting/20 ring-1 ring-meeting/40",
    chip: "bg-meeting/15 text-meeting ring-1 ring-meeting/40",
    dot: "bg-meeting",
    strong: "text-meeting",
  },
  rest: {
    cell: "bg-rest/20 ring-1 ring-rest/40",
    chip: "bg-rest/15 text-rest ring-1 ring-rest/40",
    dot: "bg-rest",
    strong: "text-rest",
  },
};
