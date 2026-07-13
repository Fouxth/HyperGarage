import { Response, NextFunction } from 'express'
import { AuthenticatedRequest } from './authMiddleware.js'

export function requireRole(allowedRoles: ('SUPERADMIN' | 'STOCK_STAFF' | 'ORDER_STAFF')[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized: Authentication required' })
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: `Forbidden: Access denied. Required role: ${allowedRoles.join(' or ')}` })
      return
    }

    next()
  }
}
