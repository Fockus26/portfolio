"use client";

import { useEffect, useState } from "react";

// Throws while rendering, but only once mounted in the browser: the server renders nothing,
// so the error is born in the client and has no digest.
export function Thrower() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (mounted) throw new Error("Falla de prueba del navegador");
  return null;
}
