import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const targets = [
  {
    outDir: 'public/assets/web/teachers',
    width: 320,
    quality: 68,
    items: [
      ['public/assets/Fotos/luis.jpeg', 'luis.webp'],
      ['public/assets/Fotos/ramiro.jpeg', 'ramiro.webp'],
      ['public/assets/Fotos/made.jpeg', 'made.webp'],
      ['public/assets/Fotos/delfi.jpeg', 'delfi.webp'],
    ],
  },
  {
    outDir: 'public/assets/web/material',
    width: 384,
    quality: 48,
    items: [
      ['public/assets/cinturones_color.jpg', 'cinturones.webp'],
      ['public/assets/1er_dan.png', '1er-dan.webp'],
      ['public/assets/2do_dan.png', '2do-dan.webp'],
      ['public/assets/3er_dan.png', '3er-dan.webp'],
      ['public/assets/4to_dan.png', '4to-dan.webp'],
      ['public/assets/hist_1.jpg', 'hist-1.webp'],
      ['public/assets/hist_2.jpg', 'hist-2.webp'],
      ['public/assets/hist_3.jpg', 'hist-3.webp'],
      ['public/assets/ceremonial.jpg', 'ceremonial.webp'],
      ['public/assets/forma_1.jpg', 'forma-1.webp'],
      ['public/assets/forma_2.jpg', 'forma-2.webp'],
      ['public/assets/forma_3.jpg', 'forma-3.webp'],
      ['public/assets/forma_4.jpg', 'forma-4.webp'],
      ['public/assets/forma_5.jpg', 'forma-5.webp'],
      ['public/assets/forma_6.jpg', 'forma-6.webp'],
      ['public/assets/forma_7.jpg', 'forma-7.webp'],
      ['public/assets/forma_8.jpg', 'forma-8.webp'],
      ['public/assets/Koryo.jpg', 'koryo.webp'],
      ['public/assets/Keumgang.jpg', 'keumgang.webp'],
      ['public/assets/Taebaek.jpg', 'taebaek.webp'],
      ['public/assets/traducciones_cuerpo.jpg', 'traducciones-cuerpo.webp'],
      ['public/assets/traducciones_1.jpg', 'traducciones-1.webp'],
      ['public/assets/traducciones_2.jpg', 'traducciones-2.webp'],
    ],
  },
  {
    outDir: 'public/assets/web/logos',
    width: 320,
    quality: 70,
    items: [['public/assets/logos/CAH.png', 'CAH.webp']],
  },
  {
    outDir: 'public/assets/web/logos',
    quality: 70,
    items: [
      ['public/assets/logos/CAH.png', 'CAH-154.webp', 154, 76],
      ['public/assets/logos/CAH.png', 'CAH-88.webp', 88, 76],
    ],
  },
  {
    outDir: 'public/assets/web/decor',
    items: [
      ['public/assets/decor/kick.png', 'kick.webp', 1200, 72],
      ['public/assets/decor/tkd.png', 'tkd.webp', 256, 80],
    ],
  },
];

for (const group of targets) {
  mkdirSync(group.outDir, { recursive: true });
  for (const item of group.items) {
    const [source, name, groupWidth, quality] = Array.isArray(item)
      ? item.length > 2
        ? [item[0], item[1], item[2], item[3]]
        : [item[0], item[1], group.width, 78]
      : [];
    const path = `${group.outDir}/${name}`;
    const image = sharp(source).resize({ width: groupWidth, withoutEnlargement: true });
    await image.webp({ quality, alphaQuality: 100 }).toFile(path);
    const stats = await sharp(path).metadata();
    console.log(`${path} ${stats.width}x${stats.height}`);
  }
}
