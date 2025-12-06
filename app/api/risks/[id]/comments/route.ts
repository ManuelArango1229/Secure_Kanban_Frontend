import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

// GET /api/risks/[id]/comments - Obtener comentarios de un riesgo
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 })

    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from("risk_comments")
      .select("*")
      .eq("risk_id", id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("GET comments error:", error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify(data || []), { status: 200 })
  } catch (err: any) {
    console.error("GET /api/risks/[id]/comments error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}

// POST /api/risks/[id]/comments - Crear comentario
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 })

    const body = await req.json()

    const { comment } = body

    if (!comment) {
      return new Response(JSON.stringify({ error: "Missing comment" }), { status: 400 })
    }

    const supabase = await getSupabaseServer()
    const { data, error } = await supabase
      .from("risk_comments")
      .insert({
        risk_id: id,
        comment,
      })
      .select()
      .single()

    if (error) {
      console.error("POST comment error:", error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    console.log("✅ Comment created:", data)
    return new Response(JSON.stringify(data), { status: 201 })
  } catch (err: any) {
    console.error("POST /api/risks/[id]/comments error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}

// DELETE /api/risks/[id]/comments/[commentId] - Eliminar comentario
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const url = new URL(req.url)
    const commentId = url.searchParams.get("commentId")

    if (!id || !commentId) {
      return new Response(JSON.stringify({ error: "Missing id or commentId" }), { status: 400 })
    }

    const supabase = await getSupabaseServer()
    const { error } = await supabase
      .from("risk_comments")
      .delete()
      .eq("id", commentId)
      .eq("risk_id", id)

    if (error) {
      console.error("DELETE comment error:", error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    console.log("✅ Comment deleted:", commentId)
    return new Response(null, { status: 204 })
  } catch (err: any) {
    console.error("DELETE /api/risks/[id]/comments error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}
