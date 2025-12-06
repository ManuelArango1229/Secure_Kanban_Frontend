import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await getSupabaseServer();
  const body = await req.json();

  // Espera un JSON con estructura:
  // {
  //   name: string,
  //   description?: string,
  //   risks: [
  //     { title: string, description?: string, severity: string, status: string }
  //   ]
  // }

  const { name, description, risks } = body;
  if (!name || !Array.isArray(risks)) {
    return NextResponse.json({ error: "Formato inválido" }, { status: 400 });
  }

  // Crear el proyecto
  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert([{ name, description }])
    .select()
    .single();

  if (projectError || !project) {
    return NextResponse.json({ error: "No se pudo crear el proyecto" }, { status: 500 });
  }

  // Crear los riesgos asociados
  if (risks.length > 0) {
    const statusMap: Record<string, string> = {
      "open": "identified",
      "in-progress": "in_progress",
      "mitigated": "mitigated",
      "closed": "closed",
    };
    const risksToInsert = risks.map((risk: any) => ({
      ...risk,
      project_id: project.id,
      status: statusMap[risk.status?.toLowerCase()] || "identified",
    }));
    const { error: risksError } = await supabase
      .from("risks")
      .insert(risksToInsert);
    if (risksError) {
      return NextResponse.json({ error: "No se pudieron crear los riesgos" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true, project });
}
