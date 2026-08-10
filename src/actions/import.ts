"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function listPendingImports() {
  return prisma.drug.findMany({
    where: { source: { in: ["BULARIO_OCR", "CURADORIA"] }, reviewed: false },
    orderBy: { activeIngredient: "asc" },
  });
}

export async function countPendingImports() {
  try {
    return await prisma.drug.count({
      where: { source: { in: ["BULARIO_OCR", "CURADORIA"] }, reviewed: false },
    });
  } catch {
    return 0;
  }
}

export type ReviewEdits = {
  activeIngredient: string;
  name: string;
  therapeuticClass: string;
  pregnancyCategory?: string | null;
  standardPosology?: string | null;
  indications?: string | null;
  contraindications?: string | null;
  adverseReactions?: string | null;
  storage?: string | null;
  presentations?: string | null;
};

export async function approveImport(id: string, edits: ReviewEdits, reviewer: string) {
  try {
    await prisma.drug.update({
      where: { id },
      data: {
        ...edits,
        reviewed: true,
        reviewedBy: reviewer || "Farmacêutico",
        reviewedAt: new Date(),
      },
    });
    revalidatePath("/importacao");
    revalidatePath("/medicamentos");
    return { ok: true };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}

export async function rejectImport(id: string) {
  try {
    await prisma.drug.delete({ where: { id } });
    revalidatePath("/importacao");
    return { ok: true };
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }
}
