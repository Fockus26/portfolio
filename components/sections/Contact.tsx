import { MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Footer } from "@/components/sections/Footer";
import { Button } from "@/components/ui/button";
import { type ContactRow, ContactRows } from "@/components/ui/ContactRows";
import { LightBand } from "@/components/ui/LightBand";
import { contact } from "@/content/contact";
import { whatsappHref } from "@/lib/links";
import { SECTION_IDS } from "@/lib/site";

// Contacto (HANDOFF § 3 · 12): the main action of the site, on the stone floor. A way to
// reach César whose address is still pending is not linked (§ 9, questions 1 and 2).
export function Contact() {
  const t = useTranslations("Contact");
  const titleId = `${SECTION_IDS.contact}-title`;
  const whatsapp = contact.whatsapp
    ? whatsappHref(contact.whatsapp)
    : undefined;

  const rows: ContactRow[] = [
    {
      label: t("rows.email"),
      href: `mailto:${contact.email}`,
      text: contact.email,
      stacked: true,
    },
  ];
  if (contact.linkedin)
    rows.push({
      label: t("rows.linkedin"),
      href: contact.linkedin,
      text: t("linkedinLink"),
    });
  if (contact.github)
    rows.push({
      label: t("rows.github"),
      href: contact.github,
      text: t("githubLink"),
    });

  return (
    <section
      id={SECTION_IDS.contact}
      aria-labelledby={titleId}
      className="page-section surface-stone relative flex flex-col overflow-clip lg:contact-h lg:pt-header"
    >
      <LightBand sectionId={SECTION_IDS.contact} />
      <div className="relative z-content container-page pt-24 lg:grid-page lg:pt-18">
        <h2
          id={titleId}
          className="text-h1 text-balance wrap-anywhere lg:col-span-11"
        >
          {t("title")}
        </h2>
        <p className="mt-6 text-h5 text-balance lg:col-span-8 lg:mt-8">
          {t("line")}
        </p>
        <div className="mt-10 lg:col-span-5 lg:mt-18">
          {whatsapp ? (
            <Button asChild size="lg" className="max-lg:w-full">
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                <MessageCircle aria-hidden="true" />
                {t("whatsapp")}
              </a>
            </Button>
          ) : (
            // No real number yet: the button is shown as the design has it, but it
            // cannot open a chat with a number that belongs to someone else
            <Button size="lg" disabled className="max-lg:w-full">
              <MessageCircle aria-hidden="true" />
              {t("whatsapp")}
            </Button>
          )}
          <p className="mt-3 text-small">
            {contact.whatsapp ?? t("provisionalNumber")}
          </p>
        </div>
        <div className="mt-10 lg:col-span-6 lg:col-start-7 lg:mt-18">
          <ContactRows rows={rows} />
        </div>
      </div>
      <Footer className="relative z-content container-page mt-14 lg:mt-auto" />
    </section>
  );
}
