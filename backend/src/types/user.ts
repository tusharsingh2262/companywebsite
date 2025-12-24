export type Role = "admin" | "emp" | "intern"

export interface User {
  id: number
  name: string
  email: string
  role: Role
}
