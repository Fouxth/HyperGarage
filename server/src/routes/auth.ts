import { Router } from 'express'
import { prisma } from '../prisma.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware.js'

export const authRouter = Router()
const JWT_SECRET = process.env.JWT_SECRET || 'hypergarage-secret-key-12345'

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    res.status(400).json({ error: 'Email and password are required' })
    return
  }

  try {
    const staff = await prisma.staff.findUnique({
      where: { email },
    })

    if (!staff) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const isValidPassword = await bcrypt.compare(password, staff.password)
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid email or password' })
      return
    }

    const token = jwt.sign(
      {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: {
        id: staff.id,
        email: staff.email,
        name: staff.name,
        role: staff.role,
      },
    })
  } catch (err) {
    res.status(500).json({ error: 'Login failed' })
  }
})

authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res) => {
  res.json({ user: req.user })
})
