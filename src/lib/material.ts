export const materialRank: Record<string, number> = {
  'examenes-gups': 0,
  'examenes-1er-dan': 1,
  'examenes-2do-dan': 2,
  'examenes-3er-dan': 3,
  'examenes-4to-dan': 4,
  'historia-1': 5,
  'historia-2': 6,
  'historia-3': 7,
  'protocolo': 8,
  'taegeuk-1': 0,
  'taegeuk-2': 1,
  'taegeuk-3': 2,
  'taegeuk-4': 3,
  'taegeuk-5': 4,
  'taegeuk-6': 5,
  'taegeuk-7': 6,
  'taegeuk-8': 7,
  'dan-koryo': 8,
  'dan-keumgang': 9,
  'dan-taebaek': 10,
  'traducciones-gups': 0,
  'traducciones-danes': 1,
  'traducciones-cuerpo': 2,
};

interface MaterialEntry {
  id: string;
  data: {
    group: string;
    section: string;
    title: string;
    description: string;
    image: string;
    w: number;
    h: number;
    href: string;
    external: boolean;
  };
}

export function materialGroups<T extends MaterialEntry>(collection: T[], group: string, limit?: number) {
  const items = collection
    .filter((entry) => entry.data.group === group)
    .sort((a, b) => (materialRank[a.id] ?? 99) - (materialRank[b.id] ?? 99))
    .slice(0, limit)
    .map((entry) => entry.data);
  const sections = [...new Set(items.map((item) => item.section))];
  return sections.map((section) => ({
    section,
    items: items.filter((item) => item.section === section),
  }));
}
