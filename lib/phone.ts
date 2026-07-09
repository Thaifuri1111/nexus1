export function validatePhone(phone: string): { valid: boolean; error?: string } {
  // Hanya Indonesia (+62)
  if (!phone.startsWith('+62')) {
    return {
      valid: false,
      error: 'Nomor HP harus menggunakan kode negara +62 (Indonesia)'
    }
  }

  const number = phone.replace('+62', '')
  if (number.length < 9 || number.length > 13) {
    return {
      valid: false,
      error: 'Nomor Indonesia harus 9-13 digit (setelah +62)'
    }
  }

  if (!/^[0-9]+$/.test(number)) {
    return {
      valid: false,
      error: 'Nomor HP hanya boleh berisi angka'
    }
  }

  return { valid: true }
}

export function formatPhone(phone: string): string {
  let cleaned = phone.replace(/\s/g, '').replace(/-/g, '')
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned
  }
  return cleaned
}