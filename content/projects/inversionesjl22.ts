import type { Project } from "@/content/types";

export const project: Project = {
  slug: "inversionesjl22",
  order: 8,
  name: "Inversiones JL22",
  kind: {
    es: "Tienda en línea con operación de bodega",
    en: "Online store with warehouse operations",
  },
  sentence: {
    es: "La bodega cierra cada pedido escaneando el QR de su factura.",
    en: "The warehouse closes each order by scanning its invoice's QR code.",
  },
  summary: {
    es: "La tienda ya vendía en línea; faltaba ordenar el trabajo interno. Cada pedido sale con su factura para impresora térmica y bodega lo cierra al escanear el QR. Cada persona del equipo ve solo los pedidos que le tocan y los envíos salen en un informe.",
    en: "The shop already sold online; its internal work needed order. Each order prints an invoice for a thermal printer and the warehouse closes it by scanning the QR code. Each team member sees only their own orders, and shipments come out in a report.",
  },
  role: {
    es: "Desarrollo a medida sobre la tienda existente del cliente.",
    en: "Custom development on the client's existing store.",
  },
  stack: ["WordPress", "WooCommerce", "PHP", "JavaScript", "Dompdf"],
  links: [
    { type: "live", url: "https://inversionesjl22.com" },
    {
      type: "case-study",
      url: "https://github.com/Fockus26/inversionesjl22-case-study",
    },
  ],
  media: {
    format: "desktop",
    video: "/work/inversionesjl22/loop",
    poster: "/work/inversionesjl22/poster.jpg",
  },
  client: { name: "Inversiones JL22", named: true },
};
