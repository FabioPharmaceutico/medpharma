// Fatores de equivalência de corticosteroides (equivalência anti-inflamatória glicocorticoide),
// expressos em mg equivalentes a 5 mg de PREDNISONA. Fonte: tabelas farmacológicas clássicas.
// Uso referencial — NÃO ajusta automaticamente o efeito mineralocorticoide nem meia-vida.
export const CORTICOIDS: Record<string, { label: string; equivTo5mgPrednisone: number }> = {
  hidrocortisona: { label: "Hidrocortisona", equivTo5mgPrednisone: 20 },
  cortisona: { label: "Cortisona (acetato)", equivTo5mgPrednisone: 25 },
  prednisona: { label: "Prednisona", equivTo5mgPrednisone: 5 },
  prednisolona: { label: "Prednisolona", equivTo5mgPrednisone: 5 },
  metilprednisolona: { label: "Metilprednisolona", equivTo5mgPrednisone: 4 },
  triancinolona: { label: "Triancinolona", equivTo5mgPrednisone: 4 },
  dexametasona: { label: "Dexametasona", equivTo5mgPrednisone: 0.75 },
  betametasona: { label: "Betametasona", equivTo5mgPrednisone: 0.6 },
};

// Converte doseMg de 'from' para dose equivalente de 'to'
export function convertCorticoid(fromKey: string, toKey: string, doseMg: number): number {
  const from = CORTICOIDS[fromKey];
  const to = CORTICOIDS[toKey];
  if (!from || !to) return NaN;
  // dose_to = dose_from * (equivTo5mg_to / equivTo5mg_from)
  return doseMg * (to.equivTo5mgPrednisone / from.equivTo5mgPrednisone);
}

// Cockcroft-Gault. Retorna ClCr em mL/min.
export function cockcroftGault(params: {
  age: number;
  weightKg: number;
  serumCreatinine: number; // mg/dL
  sex: "M" | "F";
}): number {
  const { age, weightKg, serumCreatinine, sex } = params;
  const base = ((140 - age) * weightKg) / (72 * serumCreatinine);
  return sex === "F" ? base * 0.85 : base;
}

export function classifyClcr(clcr: number): { label: string; tone: "high" | "medium" | "low" | "ok" } {
  if (clcr >= 90) return { label: "Função renal normal (≥90)", tone: "ok" };
  if (clcr >= 60) return { label: "Redução leve (60-89)", tone: "low" };
  if (clcr >= 30) return { label: "Redução moderada (30-59)", tone: "medium" };
  if (clcr >= 15) return { label: "Redução grave (15-29)", tone: "high" };
  return { label: "Falência renal (<15)", tone: "high" };
}
