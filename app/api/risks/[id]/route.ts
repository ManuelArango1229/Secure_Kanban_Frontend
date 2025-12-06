import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });

    const supabase = await getSupabaseServer();

    // Eliminar comentarios asociados al riesgo
    const { error: commentsError } = await supabase.from("risk_comments").delete().eq("risk_id", id);
    if (commentsError) return new Response(JSON.stringify({ error: commentsError.message }), { status: 500 });

    // Eliminar el riesgo
    const { error } = await supabase.from("risks").delete().eq("id", id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    return new Response(null, { status: 204 });
  } catch (err: any) {
    console.error("DELETE /api/risks/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 })

    const body = await req.json()
    const supabase = await getSupabaseServer()

    const { error: updateError } = await supabase
      .from("risks")
      .update(body)
      .eq("id", id)

    if (updateError) {
      console.error("PATCH error from Supabase:", updateError)
      return new Response(JSON.stringify({ error: updateError.message }), { status: 500 })
    }

    // Obtener el risk actualizado para devolverlo
    const { data, error: fetchError } = await supabase
      .from("risks")
      .select("*")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching updated risk:", fetchError)
      return new Response(JSON.stringify({ error: fetchError.message }), { status: 500 })
    }

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (err: any) {
    console.error("PATCH /api/risks/[id] error:", err)
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 })
  }
}
