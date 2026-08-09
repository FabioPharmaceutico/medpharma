"use server";
import { prisma } from "@/lib/prisma";

export type DrugListItem = {
  id: string;
  name: string;
  activeIngredient: string;
  therapeuticClass: string;
  pregnancyCategory: string | null;
};

export async function searchDrugs(query: string): Promise<DrugListItem[]> {
  const q = query.trim();
  const where = q
    ? {
        // SQLite: LIKE já é case-insensitive para caracteres ASCII, então não
        // usamos `mode: "insensitive"` (não suportado pelo provider sqlite).
        OR: [
          { name: { contains: q } },
          { activeIngredient: { contains: q } },
          { therapeuticClass: { contains: q } },
        ],
      }
    : {};
  return prisma.drug.findMany({
    where,
    orderBy: { activeIngredient: "asc" },
    take: 50,
    select: { id: true, name: true, activeIngredient: true, therapeuticClass: true, pregnancyCategory: true },
  });
}

export async function getDrug(id: string) {
  return prisma.drug.findUnique({
    where: { id },
    include: {
      interactionsA: { include: { drugB: { select: { id: true, name: true, activeIngredient: true } } } },
      interactionsB: { include: { drugA: { select: { id: true, name: true, activeIngredient: true } } } },
    },
  });
}

export async function listAllDrugsMinimal() {
  return prisma.drug.findMany({
    orderBy: { activeIngredient: "asc" },
    select: { id: true, name: true, activeIngredient: true, therapeuticClass: true },
  });
}
