const TZ = 'America/Argentina/Buenos_Aires';

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function isoInTz(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')}`;
}

export function todayIso(timeZone = TZ): string {
  return isoInTz(new Date(), timeZone);
}

export function daysUntil(isoDate: string, today = todayIso()): number {
  const a = new Date(isoDate).getTime();
  const b = new Date(today).getTime();
  return Math.round((a - b) / 86_400_000);
}

export function formatLong(date: Date, timeZone: string): string {
  return capitalize(
    new Intl.DateTimeFormat('es-AR', {
      timeZone,
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date),
  );
}

export function formatShort(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat('es-AR', {
    timeZone,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function formatDayMonth(date: Date, timeZone: string): string {
  return capitalize(
    new Intl.DateTimeFormat('es-AR', {
      timeZone,
      day: '2-digit',
      month: 'short',
    }).format(date),
  );
}

export function formatTime(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('es-AR', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
  return parts.replace(/\u200e|\u200f/g, '');
}

export function isoDateTime(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? '00';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

export function todayDayKey(): string {
  const raw = new Intl.DateTimeFormat('es-AR', {
    timeZone: TZ,
    weekday: 'short',
  }).format(new Date());
  const normalized = raw
    .toLowerCase()
    .replace(/\./g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  return normalized.slice(0, 3);
}

export const WEEKDAYS: Record<string, string> = {
  lun: 'Lunes',
  mar: 'Martes',
  mie: 'Miércoles',
  jue: 'Jueves',
  vie: 'Viernes',
  sab: 'Sábado',
  dom: 'Domingo',
};
