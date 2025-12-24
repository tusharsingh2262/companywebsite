import { Router } from "express"
import { authenticate, requireRole } from "../middleware/auth.js"

const router = Router()

router.get(
  "/dashboard",
  authenticate,
  requireRole("admin"),
  (req, res) => {
    res.json({ message: "Welcome Admin" })
  }
)

export default router
