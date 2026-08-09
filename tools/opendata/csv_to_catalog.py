#!/usr/bin/env python3
"""
Converte um CSV de FONTE ABERTA/OFICIAL (dados abertos Anvisa, RENAME, MedSUS)
para o formato do catálogo do MedPharma, gravando prisma/medicamentos-oficiais.ts.

Uso legítimo: use apenas fontes ABERTAS/OFICIAIS. NÃO utilize conteúdo proprietário
(Micromedex, Medscape, Drugs.com) nem o texto integral de bulas (direito autoral
dos fabricantes). Nomes de princípio ativo e classe terapêutica são fatos públicos.

Exemplo:
  python3 tools/opendata/csv_to_catalog.py \
    --csv rename.csv --col-ai "PRINCIPIO_ATIVO" --col-tc "CLASSE_TERAPEUTICA" \
    --delimiter ";" --encoding "utf-8"

Depois: git add . && git commit -m "Importa base oficial" && git push
(o deploy automático sincroniza os novos medicamentos no banco).
"""
import argparse, csv, json, re, sys
from pathlib import Path

def clean(s: str) -> str:
    return re.sub(r"\s+", " ", (s or "").strip())

def title_ai(s: str) -> str:
    s = clean(s)
    # mantém siglas curtas em maiúscula; capitaliza o resto
    return s[:1].upper() + s[1:] if s else s

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv", required=True, help="Caminho do CSV oficial")
    ap.add_argument("--col-ai", required=True, help="Nome da coluna do princípio ativo")
    ap.add_argument("--col-tc", default=None, help="Nome da coluna da classe terapêutica (opcional)")
    ap.add_argument("--col-atc", default=None, help="Nome da coluna do código ATC (opcional)")
    ap.add_argument("--delimiter", default=";")
    ap.add_argument("--encoding", default="utf-8")
    ap.add_argument("--out", default=None, help="Saída .ts (padrão: prisma/medicamentos-oficiais.ts)")
    ap.add_argument("--fonte", default="Dados abertos (Anvisa/RENAME/MedSUS)")
    args = ap.parse_args()

    out = args.out or str(Path(__file__).resolve().parents[2] / "prisma" / "medicamentos-oficiais.ts")

    seen = set()
    items = []
    with open(args.csv, newline="", encoding=args.encoding, errors="ignore") as f:
        reader = csv.DictReader(f, delimiter=args.delimiter)
        if args.col_ai not in (reader.fieldnames or []):
            print(f"[erro] coluna '{args.col_ai}' não encontrada. Colunas: {reader.fieldnames}", file=sys.stderr)
            sys.exit(1)
        for row in reader:
            ai = title_ai(row.get(args.col_ai, ""))
            if not ai or len(ai) < 2:
                continue
            key = ai.lower()
            if key in seen:
                continue
            seen.add(key)
            tc = clean(row.get(args.col_tc, "")) if args.col_tc else ""
            atc = clean(row.get(args.col_atc, "")) if args.col_atc else ""
            item = {"ai": ai, "tc": tc or "(a classificar)"}
            if atc:
                item["atc"] = atc
            items.append(item)

    body = ",\n  ".join(json.dumps(it, ensure_ascii=False) for it in items)
    ts = (
        "// GERADO AUTOMATICAMENTE por tools/opendata/csv_to_catalog.py\n"
        f"// Fonte: {args.fonte}. Nomes/classes são fatos públicos (fontes abertas/oficiais).\n"
        "// NÃO edite à mão — rode o conversor novamente para atualizar.\n"
        'import type { BaseDrug } from "./medicamentos-base";\n\n'
        f"export const MEDICAMENTOS_OFICIAIS: BaseDrug[] = [\n  {body}\n];\n"
    )
    Path(out).write_text(ts, encoding="utf-8")
    print(f"{len(items)} medicamentos gravados em {out}")
    print("Próximo passo: git add . ; git commit -m \"Importa base oficial\" ; git push")

if __name__ == "__main__":
    main()
