// import '../App.css'
// import { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { useAppDispatch } from "../store/hooks"
// import { login } from "../features/auth/authSlice"


// export default function Login() {
//   const dispatch = useAppDispatch()
//   const navigate = useNavigate()

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")
//   const [isAdmin, setIsAdmin] = useState(false)
//   const [error, setError] = useState("")

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()

//     if (!email || !password) {
//       setError("All fields are required")
//       return
//     }

//     dispatch(
//       login({
//         email,
//         role: isAdmin ? "admin" : "user",
//       })
//     )

//     navigate(isAdmin ? "/admin" : "/")
//   }

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <h2 className="auth-title">Sign in to your account</h2>

//         {error && <p className="auth-error">{error}</p>}

//         <form onSubmit={handleSubmit} className="auth-form">
//           <div className="form-group">
//             <label>Email address</label>
//             <input
//               type="email"
//               placeholder="you@example.com"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="••••••••"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <label className="checkbox">
//             <input
//               type="checkbox"
//               checked={isAdmin}
//               onChange={(e) => setIsAdmin(e.target.checked)}
//             />
//             Login as Admin
//           </label>

//           <button type="submit" className="btn primary full">
//             Sign in
//           </button>
//         </form>

//         <p className="auth-footer">
//           Don’t have an account?{" "}
//           <Link to="/signup">Create one</Link>
//         </p>
//       </div>
//     </div>
//   )
// }


// import { useState } from "react"
// import { useNavigate, Link } from "react-router-dom"
// import { useAppDispatch, useAppSelector } from "../store/hooks"
// import { loginUser } from "../features/auth/authSlice"

// export default function Login() {
//   const dispatch = useAppDispatch()
//   const navigate = useNavigate()
//   const { user, loading, error } = useAppSelector((s) => s.auth)

//   const [email, setEmail] = useState("")
//   const [password, setPassword] = useState("")

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     const res = await dispatch(loginUser({ email, password }))
//     if (loginUser.fulfilled.match(res)) {
//       navigate("/")
//     }
//   }

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <h2>Login</h2>

//         {error && <p className="auth-error">{error}</p>}

//         <form onSubmit={handleSubmit}>
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           <button className="btn primary full" disabled={loading}>
//             {loading ? "Signing in..." : "Login"}
//           </button>
//         </form>

//         <p className="auth-footer">
//           No account? <Link to="/signup">Sign up</Link>
//         </p>
//       </div>
//     </div>
//   )
// }

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { loginUser } from "../features/auth/authSlice"

// Regex Patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export default function Login() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.auth)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Field-specific errors
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  // Validation functions
  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return "Email is required"
    }
    if (!EMAIL_REGEX.test(value.trim())) {
      return "Please enter a valid email address"
    }
    return ""
  }

  const validatePassword = (value: string) => {
    if (!value) {
      return "Password is required"
    }
    return ""
  }

  // Handle input changes with validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setErrors((prev) => ({ ...prev, email: validateEmail(value) }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setErrors((prev) => ({ ...prev, password: validatePassword(value) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setErrors({
      email: emailError,
      password: passwordError,
    })

    // Don't submit if there are errors
    if (emailError || passwordError) {
      return
    }

    const res = await dispatch(loginUser({ email, password }))
    if (loginUser.fulfilled.match(res)) navigate("/")
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className={`input-wrapper ${errors.email ? "error" : ""}`}>
              <FaEnvelope className="input-icon" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => setErrors((prev) => ({ ...prev, email: validateEmail(email) }))}
                required
              />
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className={`password-input-wrapper ${errors.password ? "error" : ""}`}>
              <FaLock className="input-icon" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => setErrors((prev) => ({ ...prev, password: validatePassword(password) }))}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <button className="btn primary full" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
