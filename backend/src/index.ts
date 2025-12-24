import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import authRoutes from "./routes/auth.js"
import adminRoutes from "./routes/admin.js"
// import chapterRoutes from "./routes/chapters"

dotenv.config()

const app = express()

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
)

app.use(express.json())

app.get("/api/health", (_req, res) => {
  res.json({ ok: true })
})

app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
// app.use("/api/chapters", chapterRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`)
})
