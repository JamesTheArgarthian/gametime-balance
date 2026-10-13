import { useState, type ReactNode } from "react";
import {
  deleteEvent,
  deleteFrom,
  deleteOccurrences,
  getEventById,
  isoOf,
  monthName,
  occurrences,
  repeatLabels,
  updateEvent,
  weekdayShort,
  type RepeatFreq,
} from "@/lib/events";

const field =
  "w-full rounded-lg bg-foreground/5 px-3 py-2 text-sm text-foreground ring-1 ring-foreground/15 outline-none focus:ring-primary";

function label(d: Date) {
  return `${weekdayShort(d)}, ${monthName(d).slice(0, 3)} ${d.getDate()}, ${d.getFullYear()}`;
}

/** Repeat picker shared by the add form and the event detail card. */
export function RepeatFields({
  repeat,
  until,
  onChange,
}: {
  repeat: RepeatFreq | "none";
  until: string;
  onChange: (repeat: RepeatFreq | "none", until: string) => void;
}) {
  return (
    <div className="space-y-2">
      <select
        aria-label="Repeat"
        className={field}
        value={repeat}
        onChange={(e) => onChange(e.target.value as RepeatFreq | "none", until)}
      >
        {Object.entries(repeatLabels).map(([k, v]) => (
          <option key={k} value={k} className="bg-background">
            {v}
          </option>
        ))}
      </select>
      {repeat !== "none" && (
        <label className="block text-xs text-fog/70">
          Ends on (optional)
          <input
            type="date"
            className={field + " mt-1"}
            value={until}
            onChange={(e) => onChange(repeat, e.target.value)}
          />
        </label>
      )}
    </div>
  );
}

/** Lets the user change the repeat rule of an existing event. */
export function RepeatEditor({ id }: { id: string }) {
  const ev = getEventById(id);
  if (!ev) return null;
  return (
    <div className="mt-4">
      <div className="mb-1.5 font-mono text-[10px] tracking-[0.2em] text-muted-foreground">REPEAT</div>
      <RepeatFields
        repeat={ev.repeat ?? "none"}
        until={ev.until ?? ""}
        onChange={(r, u) =>
          updateEvent(id, r === "none" ? { repeat: undefined, until: undefined, exceptions: [] } : { repeat: r, until: u || undefined })
        }
      />
    </div>
  );
}

/** Opens the delete dialog (or deletes straight away for one-off events). */
export function RemoveTrigger({
  id,
  date,
  className,
  children,
  ariaLabel,
  onRemoved,
}: {
  id: string;
  date: Date;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
  onRemoved?: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={ariaLabel}
        className={className}
        onClick={(e) => {
          e.stopPropagation();
          const ev = getEventById(id);
          if (ev && !ev.repeat) {
            deleteEvent(id);
            onRemoved?.();
          } else setOpen(true);
        }}
      >
        {children}
      </button>
      {open && (
        <RemoveDialog
          id={id}
          date={date}
          onClose={(removed) => {
            setOpen(false);
            if (removed) onRemoved?.();
          }}
        />
      )}
    </>
  );
}

type Mode = "one" | "some" | "after" | "all";

function RemoveDialog({ id, date, onClose }: { id: string; date: Date; onClose: (removed: boolean) => void }) {
  const ev = getEventById(id);
  const [mode, setMode] = useState<Mode>("one");
  const [picked, setPicked] = useState<Set<string>>(new Set([isoOf(date)]));
  const [fromIso, setFromIso] = useState(isoOf(date));
  if (!ev) return null;
  const list = occurrences(ev, new Date(), 40);

  const confirm = () => {
    if (mode === "one") deleteOccurrences(id, [isoOf(date)]);
    else if (mode === "some") {
      if (picked.size === 0) return;
      deleteOccurrences(id, [...picked]);
    } else if (mode === "after") deleteFrom(id, fromIso);
    else deleteEvent(id);
    onClose(true);
  };

  const opt = (m: Mode, text: string) => (
    <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-foreground hover:bg-foreground/5">
      <input type="radio" name="remove-mode" checked={mode === m} onChange={() => setMode(m)} />
      {text}
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-background/70 p-4 backdrop-blur-sm"
      onClick={(e) => {
        e.stopPropagation();
        onClose(false);
      }}
    >
      <div
        role="dialog"
        aria-label="Remove repeating event"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-card p-5 text-left ring-1 ring-foreground/15"
      >
        <div className="font-display text-2xl leading-none text-foreground">REMOVE “{ev.title}”</div>
        <p className="mt-2 text-xs text-fog/70">This event repeats ({repeatLabels[ev.repeat!].toLowerCase()}). What should go?</p>
        <div className="mt-4 space-y-1">
          {opt("one", `Only this one (${label(date)})`)}
          {opt("some", "Pick which ones")}
          {opt("after", "All from a date onward")}
          {opt("all", "Every event in the series")}
        </div>

        {mode === "some" && (
          <div className="mt-3 max-h-56 space-y-0.5 overflow-y-auto rounded-lg bg-foreground/5 p-2">
            {list.length === 0 && <p className="text-xs text-muted-foreground">No upcoming dates.</p>}
            {list.map((d) => {
              const iso = isoOf(d);
              return (
                <label key={iso} className="flex items-center gap-2 px-1 py-0.5 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={picked.has(iso)}
                    onChange={(e) => {
                      const n = new Set(picked);
                      if (e.target.checked) n.add(iso);
                      else n.delete(iso);
                      setPicked(n);
                    }}
                  />
                  {label(d)}
                </label>
              );
            })}
          </div>
        )}
        {mode === "after" && (
          <label className="mt-3 block text-xs text-fog/70">
            Remove this date and everything after it
            <input type="date" className={field + " mt-1"} value={fromIso} onChange={(e) => setFromIso(e.target.value)} />
          </label>
        )}

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={confirm}
            className="flex-1 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground hover:opacity-90"
          >
            Remove
          </button>
          <button
            type="button"
            onClick={() => onClose(false)}
            className="rounded-full px-4 py-2 text-sm text-fog/80 ring-1 ring-foreground/15"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
