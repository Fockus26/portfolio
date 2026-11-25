import { expect, test } from "bun:test";
import {
  personJsonLd,
  sameAsUrls,
  serializeJsonLd,
  siteJsonLd,
  websiteJsonLd,
} from "@/lib/seo";

const base = {
  locale: "es",
  siteUrl: "https://example.com",
  siteName: "César León",
  description: "Descripción",
  jobTitle: "Desarrollador",
  contact: { email: "yo@example.com" },
};

test("sameAs only lists the profiles that exist", () => {
  expect(sameAsUrls({ email: "a@b.c" })).toEqual([]);
  expect(
    sameAsUrls({ email: "a@b.c", github: "https://github.com/x", linkedin: "" }),
  ).toEqual(["https://github.com/x"]);
});

test("the Person has no sameAs while the profiles are pending", () => {
  const person = personJsonLd(base);
  expect(person["@type"]).toBe("Person");
  expect(person.url).toBe("https://example.com/es");
  expect(person.email).toBe("mailto:yo@example.com");
  expect("sameAs" in person).toBe(false);
});

test("the Person lists sameAs when a profile exists", () => {
  const person = personJsonLd({
    ...base,
    contact: { email: "a@b.c", linkedin: "https://linkedin.com/in/x" },
  });
  expect(person.sameAs).toEqual(["https://linkedin.com/in/x"]);
});

test("the WebSite carries its language and points at the Person", () => {
  const site = websiteJsonLd({ ...base, locale: "en" });
  expect(site["@type"]).toBe("WebSite");
  expect(site.inLanguage).toBe("en");
  expect(site.url).toBe("https://example.com/en");
  expect(site.author["@id"]).toBe(personJsonLd(base)["@id"]);
});

test("the graph joins both with a single context", () => {
  const graph = siteJsonLd(base);
  expect(graph["@context"]).toBe("https://schema.org");
  expect(graph["@graph"].map((n) => n["@type"])).toEqual(["Person", "WebSite"]);
  expect(JSON.stringify(graph["@graph"])).not.toContain("@context");
});

test("serializing escapes < so the data cannot close the script tag", () => {
  const text = serializeJsonLd({ name: "</script><b>" });
  expect(text).not.toContain("<");
  expect(JSON.parse(text).name).toBe("</script><b>");
});
