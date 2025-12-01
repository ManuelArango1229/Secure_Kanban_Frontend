import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("project_id")

    const supabase = await getSupabaseServer()

    let query = supabase.from("risks").select("*")

    if (projectId) {
      query = query.eq("project_id", projectId)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err: any) {
    console.error("GET /api/risks error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { project_id, title, description, severity, status, cvss_score, cwe_id, affected_component, mitigation_plan } = body

    if (!project_id || !title) {
      return new Response(JSON.stringify({ error: "Missing required fields: project_id, title" }), { status: 400 })
    }

    const supabase = await getSupabaseServer()

    const { data, error } = await supabase
      .from("risks")
      .insert({
        project_id,
        title,
        description: description || null,
        severity: severity || "medium",
        status: status || "identified",
        cvss_score: cvss_score || null,
        cwe_id: cwe_id || null,
        affected_component: affected_component || null,
        mitigation_plan: mitigation_plan || null,
      })
      .select()

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

    return new Response(JSON.stringify(data?.[0] || null), { status: 201 })
  } catch (err: any) {
    console.error("POST /api/risks error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}
