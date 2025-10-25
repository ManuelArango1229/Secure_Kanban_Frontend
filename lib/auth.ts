// Mock authentication utilities
// Replace with real Supabase auth once integration is added

export async function getCurrentUser() {
  // Mock: Return a demo user for now
  // TODO: Replace with real Supabase auth
  return {
    id: "1",
    email: "demo@securekanban.com",
    full_name: "Demo User",
  }
}

export async function signIn(email: string, password: string) {
  // Mock sign in
  // TODO: Replace with Supabase auth
  console.log("[v0] Mock sign in:", email)
  return { success: true, user: { id: "1", email } }
}

export async function signUp(email: string, password: string, fullName: string) {
  // Mock sign up
  // TODO: Replace with Supabase auth
  console.log("[v0] Mock sign up:", email, fullName)
  return { success: true, user: { id: "1", email } }
}

export async function signOut() {
  // Mock sign out
  // TODO: Replace with Supabase auth
  console.log("[v0] Mock sign out")
  return { success: true }
}
