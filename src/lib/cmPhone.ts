/** Indicatif proposé dans le formulaire. +237 reste le défaut. */
export type DialOption = { dial: string; country: string }

const OTHER_DIALS: DialOption[] = [
  { dial: "+27", country: "Afrique du Sud" },
  { dial: "+213", country: "Algérie" },
  { dial: "+49", country: "Allemagne" },
  { dial: "+244", country: "Angola" },
  { dial: "+966", country: "Arabie saoudite" },
  { dial: "+32", country: "Belgique" },
  { dial: "+229", country: "Bénin" },
  { dial: "+226", country: "Burkina Faso" },
  { dial: "+257", country: "Burundi" },
  { dial: "+1", country: "Canada / États-Unis" },
  { dial: "+238", country: "Cap-Vert" },
  { dial: "+236", country: "Centrafrique" },
  { dial: "+86", country: "Chine" },
  { dial: "+269", country: "Comores" },
  { dial: "+242", country: "Congo" },
  { dial: "+243", country: "RD Congo" },
  { dial: "+225", country: "Côte d'Ivoire" },
  { dial: "+253", country: "Djibouti" },
  { dial: "+20", country: "Égypte" },
  { dial: "+971", country: "Émirats arabes unis" },
  { dial: "+291", country: "Érythrée" },
  { dial: "+34", country: "Espagne" },
  { dial: "+268", country: "Eswatini" },
  { dial: "+251", country: "Éthiopie" },
  { dial: "+33", country: "France" },
  { dial: "+241", country: "Gabon" },
  { dial: "+220", country: "Gambie" },
  { dial: "+233", country: "Ghana" },
  { dial: "+30", country: "Grèce" },
  { dial: "+224", country: "Guinée" },
  { dial: "+240", country: "Guinée équatoriale" },
  { dial: "+245", country: "Guinée-Bissau" },
  { dial: "+91", country: "Inde" },
  { dial: "+39", country: "Italie" },
  { dial: "+254", country: "Kenya" },
  { dial: "+266", country: "Lesotho" },
  { dial: "+231", country: "Liberia" },
  { dial: "+218", country: "Libye" },
  { dial: "+352", country: "Luxembourg" },
  { dial: "+261", country: "Madagascar" },
  { dial: "+265", country: "Malawi" },
  { dial: "+223", country: "Mali" },
  { dial: "+212", country: "Maroc" },
  { dial: "+222", country: "Mauritanie" },
  { dial: "+230", country: "Maurice" },
  { dial: "+258", country: "Mozambique" },
  { dial: "+264", country: "Namibie" },
  { dial: "+227", country: "Niger" },
  { dial: "+234", country: "Nigeria" },
  { dial: "+31", country: "Pays-Bas" },
  { dial: "+351", country: "Portugal" },
  { dial: "+250", country: "Rwanda" },
  { dial: "+44", country: "Royaume-Uni" },
  { dial: "+239", country: "Sao Tomé-et-Principe" },
  { dial: "+221", country: "Sénégal" },
  { dial: "+248", country: "Seychelles" },
  { dial: "+232", country: "Sierra Leone" },
  { dial: "+252", country: "Somalie" },
  { dial: "+249", country: "Soudan" },
  { dial: "+211", country: "Soudan du Sud" },
  { dial: "+41", country: "Suisse" },
  { dial: "+255", country: "Tanzanie" },
  { dial: "+235", country: "Tchad" },
  { dial: "+228", country: "Togo" },
  { dial: "+216", country: "Tunisie" },
  { dial: "+90", country: "Turquie" },
  { dial: "+256", country: "Ouganda" },
  { dial: "+260", country: "Zambie" },
  { dial: "+263", country: "Zimbabwe" },
]

/** +237 en tête, puis les autres pays par ordre alphabétique. */
export const DIAL_OPTIONS: DialOption[] = [
  { dial: "+237", country: "Cameroun" },
  ...OTHER_DIALS
    .filter(option => option.dial !== "+237")
    .filter((option, index, list) => list.findIndex(item => item.dial === option.dial) === index)
    .sort((a, b) => a.country.localeCompare(b.country, "fr")),
]

const DIALS_BY_LENGTH = [...DIAL_OPTIONS].sort((a, b) => b.dial.length - a.dial.length)

export const CM_PHONE = /^\+237[0-9]{9}$/

export function localBounds(dial: string): { min: number; max: number } {
  return dial === "+237" ? { min: 9, max: 9 } : { min: 7, max: 12 }
}

export function phoneFieldError(dial: string): string {
  return dial === "+237"
    ? "Le numéro local doit contenir exactement 9 chiffres (ex. 683682958)."
    : "Le numéro local doit contenir entre 7 et 12 chiffres."
}

/** Assemble l'indicatif et le numéro local, sans espaces. */
export function composePhone(dial: string, localRaw: string): string | null {
  const known = DIAL_OPTIONS.some(option => option.dial === dial)
  if (!known) return null
  const local = localRaw.replace(/\D/g, "")
  const { min, max } = localBounds(dial)
  if (local.length < min || local.length > max) return null
  return `${dial}${local}`
}

function matchDial(source: string): { dial: string; local: string } | null {
  for (const option of DIALS_BY_LENGTH) {
    if (!source.startsWith(option.dial)) continue
    const local = source.slice(option.dial.length).replace(/\D/g, "")
    const { max } = localBounds(option.dial)
    return { dial: option.dial, local: local.slice(0, max) }
  }
  return null
}

/** Accepte un indicatif de la liste, avec ou sans « + ». +237 exige 9 chiffres. */
export function normalizeOrderPhone(raw: string): string | null {
  const compact = raw.replace(/[\s.\-()]/g, "")
  const international = compact.startsWith("+")
    ? compact
    : compact.startsWith("00")
      ? `+${compact.slice(2)}`
      : null
  if (international) {
    const matched = matchDial(international)
    if (!matched) return null
    return composePhone(matched.dial, matched.local)
  }
  if (!/^\d+$/.test(compact)) return null
  for (const option of DIALS_BY_LENGTH) {
    const code = option.dial.slice(1)
    if (!compact.startsWith(code)) continue
    const local = compact.slice(code.length)
    const { min, max } = localBounds(option.dial)
    if (local.length >= min && local.length <= max) return `${option.dial}${local}`
  }
  if (/^6\d{8}$/.test(compact)) return `+237${compact}`
  return null
}

/** @deprecated Utiliser normalizeOrderPhone. Conservé pour les appels existants. */
export function normalizeCameroonPhone(raw: string): string | null {
  return normalizeOrderPhone(raw)
}

export function splitPhone(raw: string): { dial: string; local: string } {
  const compact = raw.replace(/[\s.\-()]/g, "")
  const international = compact.startsWith("+")
    ? compact
    : compact.startsWith("00")
      ? `+${compact.slice(2)}`
      : null
  if (international) {
    const matched = matchDial(international)
    if (matched) return matched
  }
  const normalized = normalizeOrderPhone(compact)
  if (normalized) {
    const matched = matchDial(normalized)
    if (matched) return matched
  }
  return { dial: "+237", local: compact.replace(/\D/g, "").slice(0, 9) }
}

/** Chiffres seuls, prêts pour https://wa.me/24112345678. */
export function toWhatsAppNumber(raw: string): string {
  const normalized = normalizeOrderPhone(raw)
  return normalized ? normalized.replace(/\D/g, "") : ""
}
