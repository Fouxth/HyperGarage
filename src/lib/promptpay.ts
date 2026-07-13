import QRCode from 'qrcode'

// Build an EMVCo-compliant PromptPay payload string that Thai banking apps can scan.
// Supports both mobile-number and national-ID / tax-ID PromptPay targets.

function tag(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

function crc16(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
      crc &= 0xffff
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

function formatTarget(id: string): string {
  const digits = id.replace(/[^0-9]/g, '')
  // Mobile number (e.g. 0812345678) -> 0066 + drop leading 0
  if (digits.length === 10 && digits.startsWith('0')) {
    return `0066${digits.slice(1)}`
  }
  // National ID (13 digits) or tax ID -> used as-is
  return digits
}

/** Returns the raw EMVCo payload string, or null when the id is unusable. */
export function buildPromptPayPayload(promptPayId: string, amount?: number): string | null {
  const target = formatTarget(promptPayId || '')
  if (!target || target.length < 13) return null

  const merchantAccount = tag('00', 'A000000677010111') + tag(target.length === 13 && !target.startsWith('0066') ? '02' : '01', target)

  let payload =
    tag('00', '01') +
    tag('01', amount && amount > 0 ? '12' : '11') +
    tag('29', merchantAccount) +
    tag('53', '764') // THB currency code
  if (amount && amount > 0) {
    payload += tag('54', amount.toFixed(2))
  }
  payload += tag('58', 'TH')
  payload += '6304'
  return payload + crc16(payload)
}

/** Generates a QR-code data URL for a PromptPay payment, or null when unavailable. */
export async function promptPayQrDataUrl(promptPayId: string, amount?: number): Promise<string | null> {
  const payload = buildPromptPayPayload(promptPayId, amount)
  if (!payload) return null
  try {
    return await QRCode.toDataURL(payload, { margin: 1, width: 240 })
  } catch {
    return null
  }
}
