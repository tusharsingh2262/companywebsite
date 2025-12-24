// // type Props = {
// //   open: boolean
// //   onClose: () => void
// // }

// // export default function Sidebar({ open, onClose }: Props) {
// //   return (
// //     <>
// //       <div className={`sidebar ${open ? "open" : ""}`}>
// //         <nav>
// //           <a style={{textDecoration: "none"}} href="#">Home</a>
// //           <a style={{textDecoration: "none"}} href="#">Services</a>
// //           <a style={{textDecoration: "none"}} href="#">Projects</a>
// //           <a style={{textDecoration: "none"}} href="#">Internships</a>
// //           <a style={{textDecoration: "none"}} href="#">Contact</a>
// //         </nav>
// //       </div>

// //       {open && <div className="backdrop" onClick={onClose} />}
// //     </>
// //   )
// // }

// // new  //

// // import { Link } from "react-router-dom"
// // import { useAuth } from "../auth/AuthContext"

// // type Props = {
// //   open: boolean
// //   onClose: () => void
// // }

// // export default function Sidebar({ open, onClose }: Props) {
// //   const { user, logout } = useAuth()

// //   const handleLogout = () => {
// //     logout()
// //     onClose()
// //   }

// //   return (
// //     <>
// //       <aside className={`sidebar ${open ? "open" : ""}`}>
// //         <nav className="sidebar-nav">
// //           {/* Public */}
// //           <Link to="/" onClick={onClose}>Home</Link>
// //           <Link to="/#services" onClick={onClose}>Services</Link>
// //           <Link to="/#projects" onClick={onClose}>Projects</Link>
// //           <Link to="/#internships" onClick={onClose}>Internships</Link>
// //           <Link to="/#contact" onClick={onClose}>Contact</Link>

// //           <div className="sidebar-divider" />

// //           {/* Auth */}
// //           {!user && (
// //             <>
// //               <Link to="/login" onClick={onClose}>Login</Link>
// //               <Link to="/signup" onClick={onClose}>Sign up</Link>
// //             </>
// //           )}

// //           {user && (
// //             <>
// //               {user.role === "admin" && (
// //                 <Link to="/admin" onClick={onClose}>
// //                   Admin Dashboard
// //                 </Link>
// //               )}

// //               <button className="sidebar-logout" onClick={handleLogout}>
// //                 Logout
// //               </button>
// //             </>
// //           )}
// //         </nav>
// //       </aside>

// //       {open && <div className="backdrop" onClick={onClose} />}
// //     </>
// //   )
// // }


// import { Link } from "react-router-dom"
// import { useAppDispatch, useAppSelector } from "../store/hooks"
// import { logout } from "../features/auth/authSlice"

// type SidebarProps = {
//   open: boolean
//   onClose: () => void
// }

// export default function Sidebar({ open, onClose }: SidebarProps) {
//   const dispatch = useAppDispatch()
//   const user = useAppSelector((state) => state.auth.user)

//   const handleLogout = () => {
//     dispatch(logout())
//     onClose()
//   }

//   return (
//     <aside className={`sidebar ${open ? "open" : ""}`}>
//       <nav>
//         <Link to="/" onClick={onClose}>
//           Home
//         </Link>

//         {!user && (
//           <>
//             <Link to="/login" onClick={onClose}>
//               Login
//             </Link>
//             <Link to="/signup" onClick={onClose}>
//               Signup
//             </Link>
//           </>
//         )}

//         {user && (
//           <>
//             {user.role === "admin" && (
//               <Link to="/admin" onClick={onClose}>
//                 Admin
//               </Link>
//             )}

//             <button className="logout-btn" onClick={handleLogout}>
//               Logout
//             </button>
//           </>
//         )}
//       </nav>
//     </aside>
//   )
// }

// import { Link } from "react-router-dom"
// import { useAppDispatch, useAppSelector } from "../store/hooks"
// import { logout } from "../features/auth/authSlice"

// type Props = {
//   open: boolean
//   onClose: () => void
// }

// export default function Sidebar({ open, onClose }: Props) {
//   const dispatch = useAppDispatch()
//   const user = useAppSelector((s) => s.auth.user)

//   return (
//     <>
//       <aside className={`sidebar ${open ? "open" : ""}`}>
//         <nav>
//           <Link to="/" onClick={onClose}>Home</Link>

//           {!user && (
//             <>
//               <Link to="/login" onClick={onClose}>Login</Link>
//               <Link to="/signup" onClick={onClose}>Signup</Link>
//             </>
//           )}

//           {user?.role === "admin" && (
//             <Link to="/admin" onClick={onClose}>Admin</Link>
//           )}

//           {user && (
//             <button
//               className="logout-btn"
//               onClick={() => {
//                 dispatch(logout())
//                 onClose()
//               }}
//             >
//               Logout
//             </button>
//           )}
//         </nav>
//       </aside>

//       {open && <div className="backdrop" onClick={onClose} />}
//     </>
//   )
// }

import { Link } from "react-router-dom"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { logout } from "../features/auth/authSlice"

type Props = {
  open: boolean
  onClose: () => void
}

export default function Sidebar({ open, onClose }: Props) {
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()

  return (
    <>
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <nav>
          <Link to="/" onClick={onClose}>Home</Link>

          {!user && (
            <>
              <Link to="/login" onClick={onClose}>Login</Link>
              <Link to="/signup" onClick={onClose}>Signup</Link>
            </>
          )}

          {user && (
            <>
              {/* User Display in Sidebar */}
              <div className="sidebar-user-display">
                <span className="user-name">👋 {user.name}</span>
                <span className="user-role-badge">{user.role}</span>
              </div>
            </>
          )}

          {user?.role === "admin" && (
            <Link to="/admin" onClick={onClose}>Admin</Link>
          )}

          {user && (
            <button
              onClick={() => {
                dispatch(logout())
                onClose()
              }}
            >
              Logout
            </button>
          )}
        </nav>
      </aside>

      {open && <div className="backdrop" onClick={onClose} />}
    </>
  )
}
