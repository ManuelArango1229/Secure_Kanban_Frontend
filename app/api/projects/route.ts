import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabaseServer()
    const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } })
  } catch (err: any) {
    console.error("GET /api/projects error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const name = (body.name || "").trim()
    const description = body.description ?? null
    if (!name) return new Response(JSON.stringify({ error: "Missing project name" }), { status: 400 })

    const supabase = await getSupabaseServer()

    // If the body includes owner_id use it, otherwise try to get user from session
    let owner_id = body.owner_id
    if (!owner_id) {
      const { data: { user } } = await supabase.auth.getUser()
      owner_id = user?.id ?? null
    }

    const payload: any = { name, description }
    if (owner_id) payload.owner_id = owner_id

    const { data, error } = await supabase.from("projects").insert(payload).select().single()
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { status: 201, headers: { "Content-Type": "application/json" } })
  } catch (err: any) {
    console.error("POST /api/projects error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}
