import { Router } from 'express'
import { prisma } from '../prisma.js'
import bcrypt from 'bcrypt'
import { authMiddleware, AuthenticatedRequest } from '../middlewares/authMiddleware.js'
import { requireRole } from '../middlewares/roleMiddleware.js'

export const staffRouter = Router()

// All staff routes require SUPERADMIN role
staffRouter.use(authMiddleware)
staffRouter.use(requireRole(['SUPERADMIN']))

// GET /api/staff - List all staff
staffRouter.get('/', async (req, res) => {
  try {
    const staffList = await prisma.staff.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    res.json(staffList)
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve staff list' })
  }
})

// POST /api/staff - Create a new staff account
staffRouter.post('/', async (req, res) => {
  const { email, password, name, role } = req.body

  if (!email || !password || !name || !role) {
    res.status(400).json({ error: 'Email, password, name, and role are required' })
    return
  }

  if (!['SUPERADMIN', 'STOCK_STAFF', 'ORDER_STAFF'].includes(role)) {
    res.status(400).json({ error: 'Invalid role specified' })
    return
  }

  try {
    const existing = await prisma.staff.findUnique({ where: { email } })
    if (existing) {
      res.status(400).json({ error: 'Email already registered' })
      return
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const newStaff = await prisma.staff.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role: role as 'SUPERADMIN' | 'STOCK_STAFF' | 'ORDER_STAFF',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    res.status(201).json(newStaff)
  } catch (err) {
    res.status(500).json({ error: 'Failed to create staff account' })
  }
})

// PATCH /api/staff/:id - Update staff details
staffRouter.patch('/:id', async (req, res) => {
  const { id } = req.params
  const { name, email, password, role } = req.body

  try {
    const staff = await prisma.staff.findUnique({ where: { id } })
    if (!staff) {
      res.status(404).json({ error: 'Staff account not found' })
      return
    }

    const data: any = {}
    if (name) data.name = name
    if (email) {
      const existing = await prisma.staff.findUnique({ where: { email } })
      if (existing && existing.id !== id) {
        res.status(400).json({ error: 'Email already in use' })
        return
      }
      data.email = email
    }
    if (password) {
      data.password = await bcrypt.hash(password, 10)
    }
    if (role) {
      if (!['SUPERADMIN', 'STOCK_STAFF', 'ORDER_STAFF'].includes(role)) {
        res.status(400).json({ error: 'Invalid role specified' })
        return
      }
      data.role = role
    }

    const updated = await prisma.staff.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      },
    })

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update staff account' })
  }
})

// DELETE /api/staff/:id - Delete a staff account
staffRouter.delete('/:id', async (req: AuthenticatedRequest, res) => {
  const { id } = req.params

  if (req.user?.id === id) {
    res.status(400).json({ error: 'You cannot delete your own account' })
    return
  }

  try {
    const staff = await prisma.staff.findUnique({ where: { id } })
    if (!staff) {
      res.status(404).json({ error: 'Staff account not found' })
      return
    }

    await prisma.staff.delete({ where: { id } })
    res.json({ message: 'Staff account deleted successfully' })
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete staff account' })
  }
})
