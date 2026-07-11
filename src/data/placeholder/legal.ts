import type { LegalPage } from "@/types/content";

export const placeholderLegalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    updatedAt: "2026-07-10",
    sections: [
      { heading: "1. Who we are", body: "Madrid Zone (“we”, “us”) operates themadridzone.com, an independent Real Madrid news publication. This policy explains what personal data we collect, why, and your rights over it." },
      { heading: "2. Data we collect", body: "Email address if you join our newsletter; anonymous usage analytics (pages viewed, device type, approximate region); and technical logs required to keep the site secure. We do not sell personal data." },
      { heading: "3. How we use it", body: "To deliver the newsletter you asked for, measure what readers value, keep the site fast and secure, and — where you consent — show relevant advertising that funds our free journalism." },
      { heading: "4. Your rights", body: "You may request access, correction, deletion or export of your data at any time, and unsubscribe from any email with one click. EU/EEA readers have rights under GDPR; contact us to exercise them." },
    ],
  },
  {
    slug: "terms",
    title: "Terms of Use",
    updatedAt: "2026-07-10",
    sections: [
      { heading: "1. Acceptance", body: "By accessing themadridzone.com you agree to these terms. If you do not agree, please do not use the site." },
      { heading: "2. Content & ownership", body: "All articles, graphics and branding are the property of Madrid Zone unless credited otherwise. You may share links and short quotes with attribution; republishing full articles requires written permission." },
      { heading: "3. Independence", body: "Madrid Zone is an independent publication and is not affiliated with, endorsed by, or connected to Real Madrid C.F. Club names and marks belong to their respective owners." },
      { heading: "4. Liability", body: "News, especially transfer news, evolves quickly. We verify before publishing but provide content “as is” without warranties; we are not liable for decisions made on the basis of our reporting." },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    updatedAt: "2026-07-10",
    sections: [
      { heading: "1. What cookies we use", body: "Essential cookies that make the site work; analytics cookies that tell us which stories readers value; and — only with your consent — advertising cookies used by our ad partners." },
      { heading: "2. Managing consent", body: "On your first visit we ask for consent for non-essential cookies. You can change or withdraw consent at any time via the “Cookie settings” link in the footer, or through your browser settings." },
      { heading: "3. Third parties", body: "Our advertising and analytics partners may set their own cookies, governed by their own policies. We list current partners on request via press@themadridzone.com." },
      { heading: "4. Retention", body: "Essential cookies expire with your session or within 12 months. Analytics identifiers are anonymised and retained no longer than 14 months." },
    ],
  },
];
