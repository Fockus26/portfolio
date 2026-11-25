# D014 · Content · Un dato de contacto pendiente no se enlaza: WhatsApp deshabilitado con «número provisional», LinkedIn y GitHub sin fila · Implemented

**Decision:** `content/contact.ts` guarda correo, WhatsApp, LinkedIn y GitHub; lo que sea
`undefined` no genera enlace. Sin número real, el botón «Escribir por WhatsApp» se muestra
deshabilitado junto a «+58 000 000 0000 · número provisional»; las filas de LinkedIn y GitHub
no se pintan hasta tener su URL.
**Why:** un `wa.me` con un número inventado abriría un chat con un desconocido, y un enlace a
`#` es un control que no hace nada. Aprobado por César el 2026-11-24 («sí, provisional»).
**Discarded alternative:** enlaces a `#` como en el mockup; ocultar el botón de WhatsApp.
**Pending:** al poner el número real el botón se activa solo y desaparece el sufijo.
