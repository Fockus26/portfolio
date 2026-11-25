import { expect, test } from "bun:test";
import { contact } from "@/content/contact";
import { isExternalHref, whatsappHref } from "@/lib/links";

test("a WhatsApp link keeps only the digits of the number", () => {
  expect(whatsappHref("+58 412-123 4567")).toBe("https://wa.me/584121234567");
  expect(whatsappHref("+58 412 1234567", "Hola César")).toBe(
    "https://wa.me/584121234567?text=Hola%20C%C3%A9sar",
  );
});

test("without digits there is no WhatsApp link", () => {
  expect(whatsappHref("")).toBeUndefined();
  expect(whatsappHref("pendiente")).toBeUndefined();
});

test("the contact data never carries a placeholder as if it were real", () => {
  expect(contact.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  for (const url of [contact.linkedin, contact.github]) {
    if (url !== undefined) expect(isExternalHref(url)).toBe(true);
  }
  if (contact.whatsapp !== undefined) {
    expect(contact.whatsapp).toMatch(/^\+\d{8,15}$/);
    expect(contact.whatsapp).not.toMatch(/0{7}/);
  }
});
