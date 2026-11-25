# D018 · Header · En las pantallas de estado el encabezado deja solo wordmark y idioma, con `:has()` desde SiteHeaderBar · Implemented

**Decision:** `StatusScreen` marca su raíz con `data-status-screen`; `SiteHeaderBar` oculta (`display: none`) el índice y «Contacto» y muestra el wordmark en texto a todo ancho con la variante arbitraria `[body:has([data-status-screen])_&]:…`. Fuera de la página principal el wordmark enlaza a `/{locale}` y el cambio de idioma no añade `#sección`.
**Why:** `app/[locale]/layout.tsx` (del que cuelga el encabezado) no se podía tocar en esta tanda; CSS puro evita el parpadeo de un estado en JavaScript, y `display: none` saca los controles del orden de tabulación y del árbol de accesibilidad (HANDOFF § 5b).
**Discarded alternative:** leer la ruta con `usePathname` en JS (parpadea y no distingue un 404 de una ruta real); un segundo layout para los estados (el 404 y el 500 viven dentro del layout de idioma).
