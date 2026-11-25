/**
 * How to reach César. A value that is `undefined` is still pending (HANDOFF § 9, questions
 * 1 and 2): its link is not rendered, so the page never points at an invented address.
 */
export type ContactInfo = {
  email: string;
  /** International format, digits only after the `+`: `+584121234567`. */
  whatsapp?: string;
  linkedin?: string;
  github?: string;
};

export const contact: ContactInfo = {
  email: "alejandrorey2654@gmail.com",
  whatsapp: "+584149771310",
  linkedin: "https://www.linkedin.com/in/cesaraleonr",
  github: "https://github.com/Fockus26",
};
