// import { Request, Response, NextFunction } from "express"
// import jwt from "jsonwebtoken"

// export type Role = "admin" | "emp" | "intern"

// export interface AuthRequest extends Request {
//   user?: {
//     id: number
//     email: string
//     role: Role
//   }
// }

// export const requireAuth =
//   (roles: Role[] = []) =>
//   (req: AuthRequest, res: Response, next: NextFunction) => {
//     const authHeader = req.headers.authorization
//     if (!authHeader) {
//       return res.status(401).json({ message: "No token provided" })
//     }

//     try {
//       const token = authHeader.split(" ")[1]
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any

//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: "Access denied" })
//       }

//       req.user = decoded
//       next()
//     } catch {
//       return res.status(401).json({ message: "Invalid token" })
//     }
//   }

// export const generateToken = (user: {
//   id: number
//   email: string
//   role: Role
// }) => {
//   return jwt.sign(user, process.env.JWT_SECRET!, {
//     expiresIn: "1d",
//   })
// }



import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

export interface AuthRequest extends Request {
  user?: {
    id: number
    email: string
    role: string
  }
}

/* ================= AUTHENTICATE ================= */
export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" })
  }

  const token = authHeader.substring(7)

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as any

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }

    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" })
  }
}

/* ================= ROLE CHECK ================= */
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" })
    }

    next()
  }
}

/* ================= TOKEN GENERATOR ================= */
export const generateToken = (user: {
  id: number
  email: string
  role: string
}) => {
  return jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: "1d",
  })
}
