import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock } from "react-icons/fa"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { signupUser } from "../features/auth/authSlice"

// Regex Patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const NAME_REGEX = /^[a-zA-Z\s]{2,50}$/
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

export default function SignupPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAppSelector((s) => s.auth)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Field-specific errors
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  })

  // Validation functions
  const validateName = (value: string) => {
    if (!value.trim()) {
      return "Name is required"
    }
    if (value.trim().length < 2) {
      return "Name must be at least 2 characters"
    }
    if (!NAME_REGEX.test(value.trim())) {
      return "Name should only contain letters and spaces"
    }
    return ""
  }

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
    if (value.length < 8) {
      return "Password must be at least 8 characters"
    }
    if (!PASSWORD_REGEX.test(value)) {
      return "Password must contain: uppercase, lowercase, number, and special character (@$!%*?&)"
    }
    return ""
  }

  // Handle input changes with validation
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    setErrors((prev) => ({ ...prev, name: validateName(value) }))
  }

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
    const nameError = validateName(name)
    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    })

    // Don't submit if there are errors
    if (nameError || emailError || passwordError) {
      return
    }

    const res = await dispatch(signupUser({ name, email, password }))
    if (signupUser.fulfilled.match(res)) {
      navigate("/")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create your account</h2>

        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className={`input-wrapper ${errors.name ? "error" : ""}`}>
              <FaUser className="input-icon" />
              <input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={handleNameChange}
                onBlur={() => setErrors((prev) => ({ ...prev, name: validateName(name) }))}
                required
              />
            </div>
            {errors.name && <span className="field-error">{errors.name}</span>}
          </div>

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
                placeholder="Create a strong password"
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
            {!errors.password && password && (
              <span className="field-hint">
                Must contain: uppercase, lowercase, number, and special character (@$!%*?&)
              </span>
            )}
          </div>

          <button className="btn primary full" disabled={loading}>
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}


