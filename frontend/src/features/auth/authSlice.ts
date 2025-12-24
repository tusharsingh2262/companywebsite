// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

// type Role = "admin" | "emp" | "intern"

// type User = {
//   id: number
//   email: string
//   role: Role
// }

// type AuthState = {
//   user: User | null
//   token: string | null
//   loading: boolean
//   error?: string
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   loading: false,
// }

// const API_URL = import.meta.env.VITE_API_URL

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (
//     data: { email: string; password: string },
//     { rejectWithValue }
//   ) => {
//     const res = await fetch(`${API_URL}/auth/login`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     })

//     if (!res.ok) {
//       const err = await res.json()
//       return rejectWithValue(err.message)
//     }

//     return res.json()
//   }
// )

// export const signupUser = createAsyncThunk(
//   "auth/signup",
//   async (
//     data: {
//       name: string
//       email: string
//       password: string
//       role?: Role
//     },
//     { rejectWithValue }
//   ) => {
//     const res = await fetch(`${API_URL}/auth/signup`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data),
//     })

//     if (!res.ok) {
//       const err = await res.json()
//       return rejectWithValue(err.message)
//     }

//     return res.json()
//   }
// )

// const authSlice = createSlice({
//   name: "auth",
//   initialState,
//   reducers: {
//     logout: (state) => {
//       state.user = null
//       state.token = null
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(loginUser.pending, (state) => {
//         state.loading = true
//         state.error = undefined
//       })
//       .addCase(loginUser.fulfilled, (state, action) => {
//         state.loading = false
//         state.user = action.payload.user
//         state.token = action.payload.token
//       })
//       .addCase(loginUser.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload as string
//       })
//   },
// })

// export const { logout } = authSlice.actions
// export default authSlice.reducer


import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

export type Role = "admin" | "emp" | "intern"

export type User = {
  id: number
  name: string
  email: string
  role: Role
}

type AuthState = {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"), // keep token on refresh
  loading: false,
  error: null,
}

const API_URL = import.meta.env.VITE_API_URL

/* ===================== LOGIN ===================== */
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    data: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        return rejectWithValue(result.message || "Login failed")
      }

      return result
    } catch (error) {
      return rejectWithValue("Network error")
    }
  }
)

/* ===================== SIGNUP ===================== */
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (
    data: {
      name: string
      email: string
      password: string
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (!res.ok) {
        return rejectWithValue(result.message || "Signup failed")
      }

      return result
    } catch (error) {
      return rejectWithValue("Network error")
    }
  }
)

/* ===================== SLICE ===================== */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.error = null
      localStorage.removeItem("token")
    },
  },
  extraReducers: (builder) => {
    builder

      /* ---------- LOGIN ---------- */
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem("token", action.payload.token)
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })

      /* ---------- SIGNUP ---------- */
      .addCase(signupUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        localStorage.setItem("token", action.payload.token)
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
