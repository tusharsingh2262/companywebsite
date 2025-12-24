import { Navigate } from "react-router-dom"
import { useAppSelector } from "../store/hooks"

type Props = {
  children: React.ReactElement
  role?: "admin" | "emp" | "intern"
}

export default function ProtectedRoute({ children, role }: Props) {
  const { user, token } = useAppSelector((s) => s.auth)

  // Not logged in at all
  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Role‑based guard if a role is specified
  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}


