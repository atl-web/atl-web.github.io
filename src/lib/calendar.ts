import {
  formatLong,
  formatShort,
  formatDayMonth,
  formatTime,
  isoInTz,
  daysUntil,
  todayIso,
} from './format';

export const CALENDAR_ID =
  '34a38a4097c145cc00d70afdf44d049d32221baef5b67c1d915cbfb5b73d10e8@group.calendar.google.com';
export const CALENDAR_TIMEZONE = 'America/Argentina/Buenos_Aires';
export const CALENDAR_EMBED_URL = `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
  CALENDAR_ID,
)}&ctz=${CALENDAR_TIMEZONE}`;

export interface SiteEvent {
  id: string;
  title: string;
  allDay: boolean;
  instant: number;
  location: string;
  description: string;
  link: string;
  dateLong: string;
  dateShort: string;
  dayMonth: string;
  timeRange: string;
  isoDate: string;
  timeIso: string;
}

export interface EventCard extends SiteEvent {
  dayIndex: number;
  totalDays: number;
}

interface RawEvent {
  id: string;
  summary?: string;
  location?: string;
  description?: string;
  htmlLink?: string;
  start: { date?: string; dateTime?: string };
  end: { date?: string; dateTime?: string };
}

export interface EventsResult {
  next: EventCard | null;
  past: EventCard[];
  future: EventCard[];
  stamp: string;
  failed: boolean;
}

function dayCount(startISO: string, endISO: string, allDay: boolean): number {
  const startUTC = new Date(`${startISO.slice(0, 10)}T00:00:00Z`);
  const endUTC = new Date(`${endISO.slice(0, 10)}T00:00:00Z`);
  const lastDayUTC = allDay
    ? new Date(endUTC.getTime() - 86_400_000)
    : endUTC;
  const days = Math.round((lastDayUTC.getTime() - startUTC.getTime()) / 86_400_000) + 1;
  return Math.max(1, days);
}

function expandEvent(raw: RawEvent): EventCard[] {
  const allDay = !raw.start.dateTime;
  const timeZone = allDay ? 'UTC' : CALENDAR_TIMEZONE;
  const startISO = raw.start.date ?? (raw.start.dateTime as string);
  const endISO = raw.end.date ?? (raw.end.dateTime as string);
  const totalDays = dayCount(startISO, endISO, allDay);
  const title = raw.summary?.trim() || 'Evento';
  const location = raw.location?.trim() ?? '';
  const description = (raw.description ?? '').trim();
  const link = raw.htmlLink ?? '';

  const cards: EventCard[] = [];
  for (let offset = 0; offset < totalDays; offset += 1) {
    const day = new Date(allDay ? `${startISO}T12:00:00Z` : startISO);
    if (offset > 0) day.setUTCDate(day.getUTCDate() + offset);
    const timeRange = allDay
      ? 'Todo el día'
      : `${formatTime(day, timeZone)} a ${formatTime(day, timeZone)}`;
    const isoDate = isoInTz(day, timeZone);
    cards.push({
      id: raw.id,
      title,
      allDay,
      instant: day.getTime(),
      location,
      description,
      link,
      dateLong: formatLong(day, timeZone),
      dateShort: formatShort(day, timeZone),
      dayMonth: formatDayMonth(day, timeZone),
      timeRange,
      isoDate,
      timeIso: allDay ? `${isoDate}T12:00:00` : `${isoDate}T${formatTime(day, timeZone)}`,
      dayIndex: offset + 1,
      totalDays,
    });
  }
  return cards;
}

function emptyResult(stamp: string): EventsResult {
  return { next: null, past: [], future: [], stamp, failed: true };
}

export function countdownLabel(event: SiteEvent): string {
  const days = daysUntil(event.isoDate, todayIso(CALENDAR_TIMEZONE));
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Mañana';
  if (days < 0) return `Hace ${Math.abs(days)} días`;
  return `Faltan ${days} días`;
}

export async function getEvents(): Promise<EventsResult> {
  const now = new Date();
  const stamp = `${formatShort(now, CALENDAR_TIMEZONE)} · ${formatTime(now, CALENDAR_TIMEZONE)} h`;
  const key = import.meta.env.CALENDAR_API_KEY as string | undefined;

  if (!key) {
    console.warn('[calendario] Falta CALENDAR_API_KEY, no se cargaron los eventos.');
    return emptyResult(stamp);
  }

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
  );
  url.searchParams.set('singleEvents', 'true');
  url.searchParams.set('orderBy', 'startTime');
  url.searchParams.set('timeMin', new Date(now.getTime() - 60 * 86_400_000).toISOString());
  url.searchParams.set('timeMax', new Date(now.getTime() + 60 * 86_400_000).toISOString());
  url.searchParams.set('maxResults', '40');
  url.searchParams.set('fields', 'items(id,summary,location,description,htmlLink,start,end)');
  url.searchParams.set('key', key);

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = (await response.json()) as { items?: RawEvent[] };
    const seen = new Set<string>();
    const cards = (payload.items ?? [])
      .flatMap(expandEvent)
      .sort((a, b) => a.instant - b.instant)
      .filter((card) => {
        const key = `${card.title}|${card.isoDate}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    const future = cards.filter((card) => card.instant >= now.getTime());
    const next = future[0] ?? null;
    const past = cards
      .filter((card) => card.instant < now.getTime())
      .filter((card) => !next || card.instant < next.instant)
      .reverse()
      .slice(0, 8);
    return {
      next,
      past,
      future: future.slice(1, 11),
      stamp,
      failed: false,
    };
  } catch (error) {
    console.warn('[calendario] No se pudo leer el calendario:', (error as Error).message);
    return emptyResult(stamp);
  }
}
