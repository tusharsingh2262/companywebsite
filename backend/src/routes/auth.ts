import { Router } from "express"
import bcrypt from "bcrypt"
import pool from "../config/connection.js"
import { generateToken } from "../middleware/auth.js"

const router = Router()

/* ================= SIGNUP ================= */
router.post("/signup", async (req, res) => {
  const { name, email, password, role = "intern" } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    const exists = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    )

    if (exists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" })
    }

    const hashed = await bcrypt.hash(password, 10)

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, hashed, role]
    )

    const user = result.rows[0]

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    res.status(201).json({ user, token })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Signup failed" })
  }
})

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    const user = result.rows[0]
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Login failed" })
  }
})

export default router
