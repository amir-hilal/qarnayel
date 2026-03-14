// Shared utility functions — no side effects, no imports from features

// Truncate a string to a maximum length with an ellipsis
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}

// Build a WhatsApp URL from a phone number
export function buildWhatsAppUrl(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  return `https://wa.me/${cleaned}`;
}

// Build a mailto URL
export function buildMailtoUrl(email: string, subject?: string): string {
  const base = `mailto:${encodeURIComponent(email)}`;
  if (subject) return `${base}?subject=${encodeURIComponent(subject)}`;
  return base;
}

// Build a tel: URL
export function buildTelUrl(phone: string): string {
  return `tel:${phone}`;
}
