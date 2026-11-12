import { useLocale } from "next-intl";
import { site } from "@/lib/site";
import { Placeholder } from "./placeholder";

/** Office hours in the current language; one schedule per line unless `inline`. */
export function OfficeHours({ inline = false }: { inline?: boolean }) {
  const locale = useLocale() === "en" ? "en" : "fil";
  if (!site.officeHours) return <Placeholder />;
  const lines = site.officeHours[locale];
  if (inline) return <>{lines.join(" · ")}</>;
  return (
    <>
      {lines.map((line) => (
        <span key={line} className="block">
          {line}
        </span>
      ))}
    </>
  );
}
