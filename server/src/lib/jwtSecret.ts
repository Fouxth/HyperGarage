import crypto from 'crypto'

let randomFallbackSecret: string | null = null

export function getJwtSecret(): string {
  if (process.env.JWT_SECRET) {
    return process.env.JWT_SECRET
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('FATAL: JWT_SECRET environment variable is required in production mode.')
  }

  if (!randomFallbackSecret) {
    randomFallbackSecret = crypto.randomUUID() + crypto.randomBytes(16).toString('hex')
    console.warn('⚠️ WARNING: JWT_SECRET environment variable is missing. Using random runtime fallback secret.')
  }

  return randomFallbackSecret
}
