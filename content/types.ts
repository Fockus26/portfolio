/** A text that exists in both site languages. */
export type Localized = { es: string; en: string };

export type ProjectLink = {
  /** live: the product itself · code: a public repo · case-study: a public write-up */
  type: "live" | "code" | "case-study";
  url: string;
};

export type Project = {
  slug: string;
  /** Position on the page, starting at 1. */
  order: number;
  name: string;
  /** What kind of product it is, in plain words ("Sitio web con pagos"). */
  kind: Localized;
  /** One sentence a client understands, about 70 characters. */
  sentence: Localized;
  /** Two or three short sentences, about 240 characters, no technical words. */
  summary: Localized;
  role: Localized;
  /** Three to five technologies, the ones a recruiter searches for. */
  stack: string[];
  /** Only links a stranger can open: a private repo is not a link. */
  links: ProjectLink[];
  media: {
    format: "desktop" | "phone" | "chat";
    /** Path without extension: the player adds .webm and .mp4. */
    video: string;
    poster: string;
  };
  /** named: false → the project is shown without the client's name. */
  client: { name: string; named: boolean };
};
