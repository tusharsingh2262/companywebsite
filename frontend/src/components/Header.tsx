// import { Link } from "react-router-dom"
// import { FaBars } from "react-icons/fa"
// import { useAppDispatch, useAppSelector } from "../store/hooks"
// import { logout } from "../features/auth/authSlice"

// /* ✅ onMenuClick MUST be OPTIONAL */
// type HeaderProps = {
//   onMenuClick?: () => void
// }

// export default function Header({ onMenuClick }: HeaderProps) {
//   const dispatch = useAppDispatch()
//   const user = useAppSelector((s) => s.auth.user)

//   return (
//     <header className="header">
//       {/* Only show menu button when handler exists (DashboardLayout) */}
//       {onMenuClick && (
//         <button className="menu-btn" onClick={onMenuClick}>
//           <FaBars color="white"/>
//         </button>
//       )}

//       <Link to="/" className="logo">
//         SHCBR Technologies
//       </Link>

//       <nav className="desktop-only">
//         <Link to="/">Home</Link>

//         {!user && (
//           <>
//             <Link to="/login">Login</Link>
//             <Link to="/signup">Signup</Link>
//           </>
//         )}

//         {user?.role === "admin" && <Link to="/admin">Admin</Link>}

//         {user && (
//           <button onClick={() => dispatch(logout())}>
//             Logout
//           </button>
//         )}
//       </nav>
//     </header>
//   )
// }


import { Link } from "react-router-dom"
import { FaBars } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { logout } from "../features/auth/authSlice"

type HeaderProps = {
  onMenuClick?: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)

  return (
    <header className="header">
      {/* ✅ Mobile / Tablet Menu Button */}
      {onMenuClick && (
        <button
          className="menu-btn"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <FaBars />
        </button>
      )}

      {/* ✅ Logo */}
      <Link to="/" className="logo">
        SHCBR Technologies
      </Link>

      {/* ✅ Desktop Navigation */}
      <nav className="desktop-only">
        <Link to="/">Home</Link>

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}

        {user && (
          <>
            {/* User Display */}
            <div className="user-display">
              <span className="user-name">👋 {user.name}</span>
              <span className="user-role-badge">{user.role}</span>
            </div>

            {user.role === "admin" && (
              <Link to="/admin">Admin</Link>
            )}

            <button
              className="btn ghost small"
              onClick={() => dispatch(logout())}
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  )
}
