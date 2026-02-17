import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('sq-AL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('sq-AL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export const WESTERN_BALKANS_COUNTRIES = [
  { code: 'AL', name: 'Albania' },
  { code: 'XK', name: 'Kosovë' },
  { code: 'MK', name: 'Maqedoni e Veriut' },
  { code: 'ME', name: 'Mal i Zi' },
  { code: 'RS', name: 'Serbi' },
  { code: 'BA', name: 'Bosnjë dhe Hercegovinë' },
]

export const PRODUCT_CATEGORIES = [
  { value: 'CLOTHING', label: 'Veshje', icon: '👕' },
  { value: 'SHOES', label: 'Këpucë', icon: '👟' },
  { value: 'BAGS', label: 'Çanta', icon: '👜' },
  { value: 'ACCESSORIES', label: 'Aksesorë', icon: '🎀' },
  { value: 'WATCHES', label: 'Ora', icon: '⌚' },
  { value: 'JEWELRY', label: 'Bizhuteri', icon: '💎' },
  { value: 'PERFUME', label: 'Parfume', icon: '🌸' },
  { value: 'COLLECTIBLES', label: 'Collectibles', icon: '🏆' },
  { value: 'OTHER', label: 'Të tjera', icon: '📦' },
]

export const PRODUCT_CONDITIONS = [
  { value: 'NEW', label: 'I ri', description: 'Me etiketa, i papërdorur', color: 'emerald' },
  { value: 'LIKE_NEW', label: 'Si i ri', description: 'I përdorur 1-2 herë, pa shenja', color: 'teal' },
  { value: 'GOOD', label: 'I mirë', description: 'Konsum i lehtë, funksional', color: 'sky' },
  { value: 'FAIR', label: 'Mesatar', description: 'Konsum i dukshëm, funksional', color: 'amber' },
]

export const VERIFICATION_LEVELS = [
  { value: 'PENDING', label: 'Në pritje', color: 'yellow' },
  { value: 'LEVEL_1', label: 'Nivel 1', description: 'Foto të verifikuara', color: 'blue' },
  { value: 'LEVEL_2', label: 'Nivel 2', description: 'Dokumente të verifikuara', color: 'purple' },
  { value: 'LEVEL_3', label: 'Nivel 3', description: 'Verifikim fizik', color: 'green' },
  { value: 'REJECTED', label: 'Refuzuar', color: 'red' },
]
