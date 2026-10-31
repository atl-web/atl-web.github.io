# Home Page Overrides

> **PROJECT:** tkd-huracan
> **Generated:** 2026-10-31 19:21:57
> **Page Type:** Landing / Marketing

> ⚠️ **IMPORTANT:** Rules in this file **override** the Master file (`design-system/MASTER.md`).
> Only deviations from the Master are documented here. For all other rules, refer to the Master.

---

## Page-Specific Rules

### Layout Overrides

- **Max Width:** 1152px (72rem, `.wrap`)
- **Flow real:** Hero (logo CA Huracán + nombre + dirección + CTA) → carrusel de eventos con la
  próxima card destacada → embed del calendario de Google → Escuela (ubicación + profes) →
  Horarios → Material (Exámenes / Formas / Traducciones) → Instagram.
- **Reemplaza** "Speakers grid > Agenda/schedule > Sponsors > Register CTA" del patrón genérico.
- **Carrusel:** un solo contenedor horizontal con `scroll-snap-type: x mandatory`; orden
  cronológico pasado → próximo → futuro; el próximo se centra al cargar. Cards pasadas/futuras
  "faded" con `background: muted` + `filter: saturate(0.55)` (sin `opacity`, para conservar
  contraste 4.5:1); máscara de fade en los bordes (`mask-image`).
- **Controles:** botones "Anteriores"/"Siguientes" con `aria-label` + `aria-controls`; track con
  `tabindex="0"` y `role="list"`; flechas de teclado mueven la track; `prefers-reduced-motion`
  usa `behavior: auto` y desactiva transiciones.
- **Datos:** eventos horneados en build (API de Google Calendar, `CALENDAR_API_KEY` como secret de
  GitHub Actions, rebuild cada 6 h). No hay fetch en el navegador. Estado vacío explícito cuando
  el fetch falla, más link al embed.

### Spacing Overrides

- No overrides — use Master spacing

### Typography Overrides

- No overrides — use Master typography

### Color Overrides

- **Strategy:** Urgency colors (countdown). Event branding. Speaker cards professional. Sponsor logos neutral.

### Component Overrides

- **Event carousel:** reemplaza el bloque de próximo evento grande. La card `.is-next` es la más
  grande (`flex-basis: min(24rem, 86vw)`) con countdown, fecha, título, horario, ubicación,
  descripción y link. Las cards pasadas/futuras muestran la descripción con clamp de 4 líneas.
- **Decoraciones marciales:** `kick.webp` y `tkd.webp` como fixed background en `body::before`
  (derecho/abajo) y `body::after` (izquierda/centro), opacidad `0.16`, ocultas debajo de `64rem`.
  Son decorativas, `pointer-events:none`, z-index `0`; el contenido queda en z-index `1`.

---

## Page-Specific Components

- No unique components for this page

---

## Recommendations

- Effects: transiciones 150–300 ms con `cubic-bezier(0.16, 1, 0.3, 1)`, `scroll-snap` en el
  carrusel, `prefers-reduced-motion` sin animaciones y estado final estático.
- CTA: "Ver próximo evento" (hero) + "Ver calendario completo" + "Ver el evento en Google Calendar".
- Imágenes: WebP optimizadas (`public/assets/web/...`, generadas con `scripts/build-images.mjs`),
  `width`/`height` reales en el markup, `height: auto`, `loading="eager"` + `fetchpriority="high"`
  para la primera imagen de material, y `loading="lazy"` para el resto.
- Performance: CSS inlineado por Astro (`build.inlineStylesheets: 'always'`), preload de
  Bebas Neue 400 y Source Sans 3 400, decorations como pseudo-elementos para no ensuciar LCP.
