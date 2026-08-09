"use server";
import { prisma } from "@/lib/prisma";
import type { Severity } from "@/lib/enums";

export type InteractionResult = {
  id: string;
  severity: Severity;
  mechanism: string;
  clinicalEffect: string;
  recommendation: string;
  reference: string | null;
  drugA: { id: string; name: string; activeIngredient: string };
  drugB: { id: string; name: string; activeIngredient: string };
};

export type FoodInteractionResult = {
  drugId: string;
  activeIngredient: string;
  name: string;
  foodInteractions: string;
};

const sevRank: Record<Severity, number> = { HIGH: 0, MEDIUM: 1, LOW: 2 };

export async function checkInteractions(drugIds: string[]): Promise<{
  interactions: InteractionResult[];
  foods: FoodInteractionResult[];
  counts: { HIGH: number; MEDIUM: number; LOW: number };
}> {
  const ids = Array.from(new Set(drugIds)).filter(Boolean);
  if (ids.length < 1) return { interactions: [], foods: [], counts: { HIGH: 0, MEDIUM: 0, LOW: 0 } };

  const interactions = await prisma.drugInteraction.findMany({
    where: { AND: [{ drugAId: { in: ids } }, { drugBId: { in: ids } }] },
    include: {
      drugA: { select: { id: true, name: true, activeIngredient: true } },
      drugB: { select: { id: true, name: true, activeIngredient: true } },
    },
  });

  interactions.sort((a, b) => sevRank[a.severity as Severity] - sevRank[b.severity as Severity]);

  const drugs = await prisma.drug.findMany({
    where: { id: { in: ids }, NOT: { foodInteractions: null } },
    select: { id: true, name: true, activeIngredient: true, foodInteractions: true },
  });

  const counts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
  for (const i of interactions) counts[i.severity as Severity]++;

  return {
    interactions: interactions.map((i) => ({ ...i, severity: i.severity as Severity })),
    foods: drugs
      .filter((d) => d.foodInteractions)
      .map((d) => ({ drugId: d.id, activeIngredient: d.activeIngredient, name: d.name, foodInteractions: d.foodInteractions! })),
    counts,
  };
}
