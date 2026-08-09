"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { interventionSchema, type InterventionInput } from "@/lib/validations";

export async function listInterventions() {
  return prisma.pharmaceuticalIntervention.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      drug: { select: { activeIngredient: true, name: true } },
      notes: { orderBy: { createdAt: "asc" } },
    },
  });
}

export type ActionState = { ok: boolean; message?: string; fieldErrors?: Record<string, string> };

export async function createIntervention(raw: InterventionInput): Promise<ActionState> {
  const parsed = interventionSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]?.toString() ?? "form";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, message: "Corrija os campos destacados.", fieldErrors };
  }
  const d = parsed.data;
  try {
    await prisma.pharmaceuticalIntervention.create({
      data: {
        patientRef: d.patientRef,
        drugId: d.drugId || null,
        drugName: d.drugName || null,
        prmType: d.prmType,
        description: d.description,
        recommendation: d.recommendation,
        doctorAcceptance: d.doctorAcceptance,
        status: d.status,
        author: d.author || null,
      },
    });
    revalidatePath("/intervencoes");
    return { ok: true, message: "Intervenção registrada com sucesso." };
  } catch (e) {
    return { ok: false, message: "Erro ao salvar. Verifique a conexão com o banco." };
  }
}

export async function deleteIntervention(id: string): Promise<ActionState> {
  try {
    await prisma.pharmaceuticalIntervention.delete({ where: { id } });
    revalidatePath("/intervencoes");
    return { ok: true };
  } catch {
    return { ok: false, message: "Não foi possível excluir." };
  }
}
