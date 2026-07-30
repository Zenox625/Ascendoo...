import * as ical from "node-ical";

export type GoogleEvent = { date: string; title: string; time: string | null };

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toTimeStr(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/**
 * Reads events from the Google Calendar private ICS feed (Settings > Integrate
 * calendar > "Secret address in iCal format"), stored server-side only as
 * GOOGLE_CALENDAR_ICS_URL. Read-only, one-way (Google -> app). Returns an
 * empty list rather than throwing if the feed isn't configured or fails to
 * load, so a bad/missing URL never breaks the page that calls it.
 */
export async function getGoogleEventsForRange(start: string, end: string): Promise<GoogleEvent[]> {
  const url = process.env.GOOGLE_CALENDAR_ICS_URL;
  if (!url) return [];

  try {
    const data = await ical.async.fromURL(url);
    const from = new Date(start + "T00:00:00");
    const to = new Date(end + "T23:59:59");
    const results: GoogleEvent[] = [];

    for (const item of Object.values(data)) {
      if (!item || (item as { type?: string }).type !== "VEVENT") continue;
      const event = item as ical.VEvent;
      const isFullDay = event.datetype === "date";
      const title = event.summary || "Untitled";

      try {
        if (event.rrule) {
          const excluded = new Set<string>();
          if (event.exdate) {
            for (const key of Object.keys(event.exdate)) {
              const ex = (event.exdate as Record<string, Date>)[key];
              if (ex instanceof Date) excluded.add(toDateStr(ex));
            }
          }
          const occurrences = event.rrule.between(from, to, true);
          for (const occ of occurrences) {
            const dateStr = toDateStr(occ);
            if (excluded.has(dateStr)) continue;
            results.push({ date: dateStr, title, time: isFullDay ? null : toTimeStr(occ) });
          }
        } else if (event.start >= from && event.start <= to) {
          results.push({ date: toDateStr(event.start), title, time: isFullDay ? null : toTimeStr(event.start) });
        }
      } catch {
        continue; // skip any single malformed event rather than failing the whole feed
      }
    }
    return results;
  } catch (e) {
    console.error("Google Calendar feed error:", e);
    return [];
  }
}
