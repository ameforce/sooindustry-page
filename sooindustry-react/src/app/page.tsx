import { getSiteStructuredData } from "@/lib/structuredData";
import { PrecisionHome } from "./_components/precision-home";

export default function HomePage() {
  const structuredData = getSiteStructuredData();

  return (
    <>
      <script
        id="site-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <PrecisionHome />
    </>
  );
}
