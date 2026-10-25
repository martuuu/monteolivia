@AGENTS.md

## Notas para Claude Code

- Antes de tocar UI, leer la sección correspondiente en `design/*.dc.html` (son bundles: el HTML real está en el `<script type="__bundler/template">`; `scripts/extract-design.py` lo extrae a `design/extracted/`).
- Para fixes rápidos: buscar el texto en `messages/*.json` o `src/data/*` antes que en componentes.
- Verificar siempre con `npm run build` (rutas estáticas) y `npm run test:e2e` si se tocan rutas, redirecciones o formularios.
- Pendientes y decisiones abiertas del proyecto: `.docs/pending.md`. QA manual: `.docs/QA.md`.
- No lanzar un subagente revisor por tarea: una revisión por sesión como máximo.
