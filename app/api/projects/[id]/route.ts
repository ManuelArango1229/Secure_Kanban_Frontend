import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 })

    const supabase = await getSupabaseServer()

    // Delete the project by id (no ownership check, as requested)
    const { error } = await supabase.from("projects").delete().eq("id", id)
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

    return new Response(null, { status: 204 })
  } catch (err: any) {
    console.error("DELETE /api/projects/[id] error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}
