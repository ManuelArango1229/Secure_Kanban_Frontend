import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 })

    const supabase = await getSupabaseServer()

    const { error } = await supabase.from("risks").delete().eq("id", id)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

    return new Response(null, { status: 204 })
  } catch (err: any) {
    console.error("DELETE /api/risks/[id] error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 })

    const body = await req.json()
    const supabase = await getSupabaseServer()

    const { error } = await supabase
      .from("risks")
      .update(body)
      .eq("id", id)

    if (error) {
      console.error("PATCH error from Supabase:", error)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err: any) {
    console.error("PATCH /api/risks/[id] error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}
