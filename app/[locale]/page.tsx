import { getTranslations } from "next-intl/server";
import { SECTION_IDS } from "@/lib/site";

// Provisional: the real page (entrance, nine rooms, about, contact) arrives in phase 04.
// It only puts the container, the grid and an anchor target of phase 02 on screen.
export default async function Home() {
  const t = await getTranslations("Entrance");

  return (
    <section
      id={SECTION_IDS.entrance}
      className="page-section container-page grid-page pt-header"
    >
      <div className="col-span-full flex flex-col gap-10 py-24 lg:col-span-9">
        <h1 className="text-display text-balance">{t("name")}</h1>
        <p className="text-h4 text-balance">{t("line")}</p>
      </div>
    </section>
  );
}
