/**
 * Importa o JSON gerado por ocr_bulario.py para o banco (Prisma).
 * Todos os registros entram com source=BULARIO_OCR e reviewed=false —
 * exigem validação farmacêutica na tela /importacao antes do uso clínico.
 *
 * Uso:  npx tsx tools/bulario/import_to_db.ts caminho/mono.json
 */
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const prisma = new PrismaClient();

type Mono = {
  _name: string;
  sourcePage?: number;
  sourceRef?: string;
  indications?: string;
  standardPosology?: string;
  contraindications?: string;
  adverseReactions?: string;
  interactionsText?: string;
  storage?: string;
  presentations?: string;
  rawText?: string;
};

function clean(s?: string): string | null {
  if (!s) return null;
  const t = s.replace(/\s+/g, " ").trim();
  return t.length ? t : null;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("Uso: npx tsx tools/bulario/import_to_db.ts <mono.json>");
    process.exit(1);
  }
  const monos: Mono[] = JSON.parse(readFileSync(file, "utf8"));
  let created = 0, updated = 0, skipped = 0;

  for (const m of monos) {
    const name = clean(m._name);
    if (!name || name.length < 3) { skipped++; continue; }

    const data = {
      name,
      activeIngredient: name,
      therapeuticClass: "(a classificar)",
      indications: clean(m.indications),
      standardPosology: clean(m.standardPosology),
      contraindications: clean(m.contraindications),
      // RAM importada como texto (será estruturada na revisão)
      adverseReactions: clean(m.adverseReactions),
      storage: clean(m.storage),
      presentations: clean(m.presentations),
      description: clean(m.interactionsText)
        ? `Interações (bulário): ${clean(m.interactionsText)}`
        : null,
      rawText: clean(m.rawText),
      source: "BULARIO_OCR" as const,
      sourceRef: clean(m.sourceRef),
      sourcePage: m.sourcePage ?? null,
      reviewed: false,
    };

    try {
      const existing = await prisma.drug.findFirst({
        where: { activeIngredient: name, name },
      });
      if (existing) {
        // não sobrescreve registros já revisados/curados
        if (existing.reviewed) { skipped++; continue; }
        await prisma.drug.update({ where: { id: existing.id }, data });
        updated++;
      } else {
        await prisma.drug.create({ data });
        created++;
      }
    } catch (e) {
      console.error(`  ! erro em "${name}":`, (e as Error).message);
      skipped++;
    }
  }

  console.log(`\nImportação concluída: ${created} criados, ${updated} atualizados, ${skipped} ignorados.`);
  console.log("Revise em /importacao antes de qualquer uso clínico.");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
