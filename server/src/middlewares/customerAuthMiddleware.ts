import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getJwtSecret } from '../lib/jwtSecret.js'

export interface AuthenticatedCustomerRequest extends Request {
  customer?: {
    id: string
    email: string
    name: string
  }
}

export function customerAuthMiddleware(req: AuthenticatedCustomerRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing token' })
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string; email: string; name: string; role?: string }
    if (decoded.role) {
      // Staff tokens carry a `role` claim; reject them here so a staff
      // login can never be reused to authenticate as a customer.
      res.status(401).json({ error: 'Unauthorized: Not a customer token' })
      return
    }
    req.customer = { id: decoded.id, email: decoded.email, name: decoded.name }
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' })
  }
}
