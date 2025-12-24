import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Pool } from "pg"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

// Simple request logger so you can SEE every call in the terminal
app.use((req, _res, next) => {
  console.log(
    `[REQ] ${req.method} ${req.url} body=`,
    // avoid dumping very big bodies
    JSON.stringify(req.body || {}, null, 2)
  )
  next()
})

/* ====================== DATABASE ====================== */
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "company_auth_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
})

/* Simple health‑check for DB */
app.get("/api/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1")
    res.json({ ok: true })
  } catch (err) {
    console.error("DB health check failed", err)
    res.status(500).json({ ok: false, error: "DB connection failed" })
  }
})

/* ====================== AUTH HELPERS ====================== */
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me"

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }
  )
}

/* ====================== AUTHENTICATION MIDDLEWARE ====================== */
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" })
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" })
  }

  next()
}

/* ====================== AUTH ROUTES ====================== */
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password, role = "intern" } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" })
  }

  try {
    console.log("[SIGNUP] Checking if user exists:", email)
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
    const token = generateToken(user)

    console.log("[SIGNUP] Created user:", user)

    res.status(201).json({ user, token })
  } catch (err) {
    console.error("[SIGNUP ERROR]", err)
    res.status(500).json({ message: "Signup failed" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" })
  }

  try {
    console.log("[LOGIN] Looking up user:", email)
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    )

    const user = result.rows[0]
    if (!user) {
      console.log("[LOGIN] No user found for email:", email)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      console.log("[LOGIN] Wrong password for:", email)
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user)

    console.log("[LOGIN] Successful for:", email)

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
    console.error("[LOGIN ERROR]", err)
    res.status(500).json({ message: "Login failed" })
  }
})

/* ====================== DEMO DATA (SERVICES / PROJECTS) ====================== */
const services = [
  "Software Development",
  "Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "Training & Workshops",
  "Internship Programs",
  "Project Guidance",
  "AI Integration",
]

const internships = [
  {
    id: 1,
    title: "Web Development Intern",
    skills: ["React", "TypeScript", "Tailwind"],
    duration: "3 months",
    mode: "Remote",
    stipend: "Performance-based",
    status: "Accepting",
    link: "https://example.com/apply/web",
  },
  {
    id: 2,
    title: "Machine Learning Intern",
    skills: ["Python", "TensorFlow", "Data Ops"],
    duration: "4 months",
    mode: "Hybrid",
    stipend: "Yes",
    status: "Accepting",
    link: "https://example.com/apply/ml",
  },
  {
    id: 3,
    title: "Cloud & DevOps Intern",
    skills: ["AWS", "CI/CD", "Docker"],
    duration: "2 months",
    mode: "Onsite",
    stipend: "Yes",
    status: "Accepting",
    link: "https://example.com/apply/cloud",
  },
]

const projects = [
  {
    id: 1,
    title: "Realtime Analytics Dashboard",
    tech: ["React", "Node", "WebSockets"],
    desc: "Live telemetry for IoT fleets with alerting and anomaly detection.",
    link: "#",
    github: "#",
  },
  {
    id: 2,
    title: "AI Resume Screener",
    tech: ["Python", "NLP", "Vector DB"],
    desc: "Automated candidate shortlisting with explainable scoring.",
    link: "#",
    github: "#",
  },
  {
    id: 3,
    title: "Fintech Mobile Suite",
    tech: ["React Native", "GraphQL", "Stripe"],
    desc: "Secure payments, KYC, and savings automation in one app.",
    link: "#",
    github: "#",
  },
]

app.get("/api/services", (_req, res) => {
  res.json({ services })
})

app.get("/api/projects", (_req, res) => {
  res.json({ projects })
})

/* ====================== INTERNSHIPS ROUTES ====================== */

// GET all internships (public)
app.get("/api/internships", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM internships ORDER BY created_at DESC"
    )
    res.json({ internships: result.rows })
  } catch (err) {
    console.error("[GET INTERNSHIPS ERROR]", err)
    res.status(500).json({ message: "Failed to fetch internships" })
  }
})

// POST create internship (admin only)
app.post("/api/internships", authenticate, requireAdmin, async (req, res) => {
  const { title, skills, duration, mode, stipend, status, link, description } =
    req.body

  if (!title || !duration || !mode || !stipend) {
    return res.status(400).json({ message: "Title, duration, mode, and stipend are required" })
  }

  try {
    console.log("[CREATE INTERNSHIP] Admin:", req.user.email)
    const result = await pool.query(
      `INSERT INTO internships (title, skills, duration, mode, stipend, status, link, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        title,
        skills || [],
        duration,
        mode,
        stipend,
        status || "Accepting",
        link || null,
        description || null,
      ]
    )

    console.log("[CREATE INTERNSHIP] Created:", result.rows[0].id)
    res.status(201).json({ internship: result.rows[0] })
  } catch (err) {
    console.error("[CREATE INTERNSHIP ERROR]", err)
    res.status(500).json({ message: "Failed to create internship" })
  }
})

// PUT update internship (admin only)
app.put("/api/internships/:id", authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params
  const { title, skills, duration, mode, stipend, status, link, description } =
    req.body

  try {
    console.log("[UPDATE INTERNSHIP] ID:", id, "Admin:", req.user.email)
    const result = await pool.query(
      `UPDATE internships 
       SET title = $1, skills = $2, duration = $3, mode = $4, stipend = $5, 
           status = $6, link = $7, description = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9
       RETURNING *`,
      [title, skills, duration, mode, stipend, status, link, description, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Internship not found" })
    }

    console.log("[UPDATE INTERNSHIP] Updated:", id)
    res.json({ internship: result.rows[0] })
  } catch (err) {
    console.error("[UPDATE INTERNSHIP ERROR]", err)
    res.status(500).json({ message: "Failed to update internship" })
  }
})

// DELETE internship (admin only)
app.delete("/api/internships/:id", authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params

  try {
    console.log("[DELETE INTERNSHIP] ID:", id, "Admin:", req.user.email)
    const result = await pool.query("DELETE FROM internships WHERE id = $1 RETURNING *", [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Internship not found" })
    }

    console.log("[DELETE INTERNSHIP] Deleted:", id)
    res.json({ message: "Internship deleted successfully" })
  } catch (err) {
    console.error("[DELETE INTERNSHIP ERROR]", err)
    res.status(500).json({ message: "Failed to delete internship" })
  }
})

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API ready on http://localhost:${PORT}`)
})

