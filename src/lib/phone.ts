export type Operator = "orange" | "mtn";

const ORANGE_PREFIXES = ["69", "655", "656", "657", "658", "659"];
const MTN_PREFIXES    = ["67", "68", "650", "651", "652", "653", "654"];

export function detectOperator(phone: string): Operator | null {
  if (phone.length < 2) return null;
  const p2 = phone.slice(0, 2);
  if (p2 === "69") return "orange";
  if (p2 === "67" || p2 === "68") return "mtn";
  if (phone.length >= 3) {
    const p3 = phone.slice(0, 3);
    if (["655", "656", "657", "658", "659"].includes(p3)) return "orange";
    if (["650", "651", "652", "653", "654"].includes(p3)) return "mtn";
  }
  return null;
}

export function isValidPhone(phone: string): boolean {
  return /^\d{9}$/.test(phone);
}

export function isOperatorConsistent(phone: string, operator: Operator): boolean {
  if (operator === "orange") return ORANGE_PREFIXES.some(p => phone.startsWith(p));
  if (operator === "mtn")    return MTN_PREFIXES.some(p => phone.startsWith(p));
  return false;
}

export { ORANGE_PREFIXES, MTN_PREFIXES };
