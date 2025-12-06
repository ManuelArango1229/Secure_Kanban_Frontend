import type { NextRequest } from "next/server"
import { getSupabaseServer } from "@/lib/supabase/server"

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) return new Response(JSON.stringify({ error: "Missing id" }), { status: 400 });

    const supabase = await getSupabaseServer();

    // 1. Obtener los riesgos del proyecto
    const { data: risks, error: risksError } = await supabase.from("risks").select("id").eq("project_id", id);
    if (risksError) return new Response(JSON.stringify({ error: risksError.message }), { status: 500 });

    // 2. Eliminar comentarios de riesgos
    if (risks && risks.length > 0) {
      const riskIds = risks.map(r => r.id);
      const { error: commentsError } = await supabase.from("risk_comments").delete().in("risk_id", riskIds);
      if (commentsError) return new Response(JSON.stringify({ error: commentsError.message }), { status: 500 });
    }

    // 3. Eliminar riesgos
    const { error: delRisksError } = await supabase.from("risks").delete().eq("project_id", id);
    if (delRisksError) return new Response(JSON.stringify({ error: delRisksError.message }), { status: 500 });

    // 4. Eliminar el proyecto
    const { error: delProjectError } = await supabase.from("projects").delete().eq("id", id);
    if (delProjectError) return new Response(JSON.stringify({ error: delProjectError.message }), { status: 500 });

    return new Response(null, { status: 204 });
  } catch (err: any) {
    console.error("DELETE /api/projects/[id] error:", err);
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
