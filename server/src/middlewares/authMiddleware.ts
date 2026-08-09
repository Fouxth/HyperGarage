import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { getJwtSecret } from '../lib/jwtSecret.js'
import { prisma } from '../prisma.js'

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    name: string
    role: 'SUPERADMIN' | 'STOCK_STAFF' | 'ORDER_STAFF'
  }
}

export async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing token' })
    return
  }

  const token = authHeader.split(' ')[1]
  try {
    const decoded = jwt.verify(token, getJwtSecret()) as { id: string; role?: string }
    if (!decoded || !decoded.id || !decoded.role) {
      res.status(401).json({ error: 'Unauthorized: Staff authentication required' })
      return
    }

    const staff = await prisma.staff.findUnique({ where: { id: decoded.id } })
    if (!staff) {
      res.status(401).json({ error: 'Unauthorized: Staff account no longer exists' })
      return
    }

    req.user = {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: staff.role,
    }
    next()
  } catch {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' })
  }
}
