"use server";
import { prisma } from "@/lib/prisma";

export type DrugListItem = {
  id: string;
  name: string;
  activeIngredient: string;
  therapeuticClass: string;
  pregnancyCategory: string | null;
  reviewed?: boolean;
};

export async function searchDrugs(query: string, reviewedOnly = false): Promise<DrugListItem[]> {
  const q = query.trim();
  const filters: any[] = [];
  if (q) {
    // SQLite: LIKE já é case-insensitive para caracteres ASCII (sem `mode`).
    filters.push({
      OR: [
        { name: { contains: q } },
        { activeIngredient: { contains: q } },
        { therapeuticClass: { contains: q } },
      ],
    });
  }
  if (reviewedOnly) filters.push({ reviewed: true });
  const where = filters.length ? { AND: filters } : {};
  return prisma.drug.findMany({
    where,
    orderBy: { activeIngredient: "asc" },
    take: 100,
    select: { id: true, name: true, activeIngredient: true, therapeuticClass: true, pregnancyCategory: true, reviewed: true },
  });
}

export async function countDrugs(reviewedOnly = false): Promise<number> {
  return prisma.drug.count({ where: reviewedOnly ? { reviewed: true } : {} });
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

export async function getDrugsByIds(ids: string[]): Promise<DrugListItem[]> {
  const clean = Array.from(new Set(ids)).filter(Boolean);
  if (clean.length === 0) return [];
  return prisma.drug.findMany({
    where: { id: { in: clean } },
    select: { id: true, name: true, activeIngredient: true, therapeuticClass: true, pregnancyCategory: true },
  });
}
