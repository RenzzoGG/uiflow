# CLAUDE.md

Reglas de trabajo para este repositorio.

## Sobre el proyecto

- UIFlow: producto SaaS **ficticio** de concepto. Incluye una landing de marketing (`index.html`) y un admin dashboard (`dashboard.html`) con gráficas, tabla de usuarios y modo oscuro.
- Forma parte del portafolio de Renzzo (renzzogg.com). Antes vivía en `public/projects/UIFlow/` (y antes en `assets/projects/UIFlow/`) del repo del portafolio; se extrajo aquí conservando su historial de git.
- Desplegado en **Railway** como **sitio estático** en **uiflow.renzzogg.com** desde la rama `main`.
- **Cada push a `main` se publica en vivo** en uiflow.renzzogg.com vía Railway.
- Railway (Railpack) lo detecta como sitio estático porque `index.html` está en la raíz del repo. **Todo lo que esté en el repo es público.**

## Estructura del repo

```
index.html           # Landing de UIFlow
dashboard.html       # Admin dashboard
favicon.svg          # Ícono de la pestaña (logo de UIFlow)
assets/
├── css/
│   ├── style.css      # Estilos de la landing
│   └── dashboard.css  # Estilos del dashboard (tema claro/oscuro)
├── js/
│   ├── app.js         # Landing: acordeón del FAQ
│   └── dashboard.js   # Dashboard: gráficas, vistas, tabla, modo oscuro
├── fonts/             # Inter variable auto-alojada (woff2) + licencia OFL.txt
└── img/               # Logo del navbar y capturas en WebP
README.md
CLAUDE.md
.gitignore
```

- Las rutas a recursos propios son **relativas** (`assets/...`, `dashboard.html`, `index.html`); no deben depender de estar dentro del portafolio.
- Los botones de acción de la landing (Log in, Get Started, Start for Free y los de Pricing) llevan a `dashboard.html`; el logo de la sidebar del dashboard vuelve a `index.html`.
- El servidor distingue mayúsculas en los nombres de archivo.
- Logos: `favicon.svg` (solo el ícono; también lo usa la sidebar del dashboard junto al texto "UIFlow") y `logo-wordmark*.webp` (ícono + nombre con fondo transparente para el navbar de la landing, en 1x/2x/3x vía `srcset`). Si se regeneran, hacerlo desde el PNG original de 1024 px del historial (`git show 6557e43^:assets/img/Logo.png`).

## Forma de trabajo

- Soy estudiante de Ingeniería de Software y quiero aprender: **explica las decisiones importantes antes de implementarlas** (qué opciones hay, cuál recomiendas y por qué).

## Git

- Trabajamos directo en la rama `main`, **sin crear ramas nuevas**.
- Haz commits **locales** con mensajes claros en español.
- **NUNCA** hagas `git push` ni ningún otro comando que suba cambios al remoto. El push lo hago yo.

## Stack

- HTML, CSS y JavaScript puro, sin paso de build.
- Librerías desde CDN, **siempre con versión exacta**: Chart.js 4.5.1 (jsDelivr).
- Fuente: **Inter** auto-alojada en `assets/fonts/inter-latin-wght.woff2` (de `@fontsource-variable/inter@5.2.5`, subconjunto latino, pesos 100–900). Se declara con `@font-face` en ambos CSS y se precarga en ambos HTML. No usar Google Fonts.
- Sin frameworks ni dependencias de npm, salvo que yo lo apruebe explícitamente. No crear `package.json` en la raíz: haría que Railpack trate el sitio como app de Node en lugar de estático.
- Probar localmente con `python3 -m http.server 8000` → `http://localhost:8000` (landing) y `http://localhost:8000/dashboard.html` (dashboard).

## Reporte al terminar cada tarea

Al terminar cada tarea, entrega un **REPORTE** con:

1. Qué hiciste.
2. Archivos creados / modificados / borrados.
3. Commits hechos (hash y mensaje).
4. Problemas o dudas.
5. Siguientes pasos sugeridos.
