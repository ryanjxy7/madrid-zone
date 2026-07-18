/**
 * Country names + ISO 3166-1 alpha-2 codes, used two places:
 *  - the Sanity player schema's "nationality" field options.list, so
 *    editors pick from a fixed dropdown instead of free-typing (which is
 *    what lets countryFlag() below reliably resolve a flag — matching a
 *    hand-typed "USA" vs "United States" vs "U.S.A." isn't reliable, a
 *    closed list is).
 *  - countryFlag(), which turns the picked name into a flag emoji shown
 *    next to nationality on a player's profile page.
 */
export const COUNTRIES: { name: string; code: string }[] = [
  { name: "Afghanistan", code: "AF" },
  { name: "Albania", code: "AL" },
  { name: "Algeria", code: "DZ" },
  { name: "Angola", code: "AO" },
  { name: "Argentina", code: "AR" },
  { name: "Armenia", code: "AM" },
  { name: "Australia", code: "AU" },
  { name: "Austria", code: "AT" },
  { name: "Azerbaijan", code: "AZ" },
  { name: "Belgium", code: "BE" },
  { name: "Benin", code: "BJ" },
  { name: "Bolivia", code: "BO" },
  { name: "Bosnia and Herzegovina", code: "BA" },
  { name: "Brazil", code: "BR" },
  { name: "Bulgaria", code: "BG" },
  { name: "Burkina Faso", code: "BF" },
  { name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },
  { name: "Cape Verde", code: "CV" },
  { name: "Central African Republic", code: "CF" },
  { name: "Chad", code: "TD" },
  { name: "Chile", code: "CL" },
  { name: "China", code: "CN" },
  { name: "Colombia", code: "CO" },
  { name: "Congo", code: "CG" },
  { name: "Costa Rica", code: "CR" },
  { name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },
  { name: "Cyprus", code: "CY" },
  { name: "Czech Republic", code: "CZ" },
  { name: "DR Congo", code: "CD" },
  { name: "Denmark", code: "DK" },
  { name: "Dominican Republic", code: "DO" },
  { name: "Ecuador", code: "EC" },
  { name: "Egypt", code: "EG" },
  { name: "England", code: "GB-ENG" },
  { name: "Equatorial Guinea", code: "GQ" },
  { name: "Estonia", code: "EE" },
  { name: "Ethiopia", code: "ET" },
  { name: "Finland", code: "FI" },
  { name: "France", code: "FR" },
  { name: "Gabon", code: "GA" },
  { name: "Gambia", code: "GM" },
  { name: "Georgia", code: "GE" },
  { name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },
  { name: "Greece", code: "GR" },
  { name: "Guatemala", code: "GT" },
  { name: "Guinea", code: "GN" },
  { name: "Honduras", code: "HN" },
  { name: "Hungary", code: "HU" },
  { name: "Iceland", code: "IS" },
  { name: "India", code: "IN" },
  { name: "Indonesia", code: "ID" },
  { name: "Iran", code: "IR" },
  { name: "Iraq", code: "IQ" },
  { name: "Ireland", code: "IE" },
  { name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },
  { name: "Ivory Coast", code: "CI" },
  { name: "Jamaica", code: "JM" },
  { name: "Japan", code: "JP" },
  { name: "Jordan", code: "JO" },
  { name: "Kazakhstan", code: "KZ" },
  { name: "Kenya", code: "KE" },
  { name: "South Korea", code: "KR" },
  { name: "Kosovo", code: "XK" },
  { name: "Latvia", code: "LV" },
  { name: "Lebanon", code: "LB" },
  { name: "Libya", code: "LY" },
  { name: "Lithuania", code: "LT" },
  { name: "Luxembourg", code: "LU" },
  { name: "Madagascar", code: "MG" },
  { name: "Mali", code: "ML" },
  { name: "Malta", code: "MT" },
  { name: "Mexico", code: "MX" },
  { name: "Moldova", code: "MD" },
  { name: "Montenegro", code: "ME" },
  { name: "Morocco", code: "MA" },
  { name: "Mozambique", code: "MZ" },
  { name: "Netherlands", code: "NL" },
  { name: "New Zealand", code: "NZ" },
  { name: "Nicaragua", code: "NI" },
  { name: "Niger", code: "NE" },
  { name: "Nigeria", code: "NG" },
  { name: "North Macedonia", code: "MK" },
  { name: "Northern Ireland", code: "GB-NIR" },
  { name: "Norway", code: "NO" },
  { name: "Panama", code: "PA" },
  { name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },
  { name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },
  { name: "Qatar", code: "QA" },
  { name: "Romania", code: "RO" },
  { name: "Russia", code: "RU" },
  { name: "Saudi Arabia", code: "SA" },
  { name: "Scotland", code: "GB-SCT" },
  { name: "Senegal", code: "SN" },
  { name: "Serbia", code: "RS" },
  { name: "Sierra Leone", code: "SL" },
  { name: "Slovakia", code: "SK" },
  { name: "Slovenia", code: "SI" },
  { name: "South Africa", code: "ZA" },
  { name: "Spain", code: "ES" },
  { name: "Sweden", code: "SE" },
  { name: "Switzerland", code: "CH" },
  { name: "Syria", code: "SY" },
  { name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },
  { name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },
  { name: "United States", code: "US" },
  { name: "Uruguay", code: "UY" },
  { name: "Uzbekistan", code: "UZ" },
  { name: "Venezuela", code: "VE" },
  { name: "Wales", code: "GB-WLS" },
  { name: "Zambia", code: "ZM" },
  { name: "Zimbabwe", code: "ZW" },
];

const COUNTRY_CODE_BY_NAME = new Map(COUNTRIES.map((c) => [c.name, c.code]));

/**
 * "Spain" -> "🇪🇸". The four UK home nations (England, Scotland, Wales,
 * Northern Ireland) use their FIFA associations' unofficial-but-universal
 * flags rather than a real ISO code, since there's no such thing as a
 * single-country regional-indicator flag for them and football always
 * treats them as separate nations. Returns null for anything not in
 * COUNTRIES (e.g. free-text nationality data from before this field had a
 * fixed list), so callers can fall back to showing no flag rather than a
 * broken one.
 */
export function countryFlag(name: string | undefined | null): string | null {
  if (!name) return null;
  const code = COUNTRY_CODE_BY_NAME.get(name.trim());
  if (!code) return null;

  switch (code) {
    case "GB-ENG":
      return "🏴󠁧󠁢󠁥󠁮󠁧󠁿";
    case "GB-SCT":
      return "🏴󠁧󠁢󠁳󠁣󠁴󠁿";
    case "GB-WLS":
      return "🏴󠁧󠁢󠁷󠁬󠁳󠁿";
    case "GB-NIR":
      return "🇬🇧";
    default:
      return Array.from(code.toUpperCase())
        .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
        .join("");
  }
}

/**
 * "Spain" -> a circular flag icon URL. Used on Squad cards, where a real
 * image renders more consistently across browsers/OSes than the emoji
 * countryFlag() returns above (emoji flag support varies, especially on
 * Windows) — same open-source circle-flags set (HatScripts/circle-flags
 * via jsDelivr) the design itself uses. Returns null for anything not in
 * COUNTRIES, same graceful-no-flag-shown fallback as countryFlag().
 */
export function countryFlagUrl(name: string | undefined | null): string | null {
  if (!name) return null;
  const code = COUNTRY_CODE_BY_NAME.get(name.trim());
  if (!code) return null;
  return `https://cdn.jsdelivr.net/gh/HatScripts/circle-flags@2.7.0/flags/${code.toLowerCase()}.svg`;
}
