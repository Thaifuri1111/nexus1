export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `+1${cleaned}`
  }
  if (!cleaned.startsWith('1') && cleaned.length === 11) {
    return `+${cleaned}`
  }
  return `+${cleaned}`
}

export function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}