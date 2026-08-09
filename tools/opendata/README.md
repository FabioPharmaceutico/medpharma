# Importador de base oficial (dados abertos)

Amplia o catálogo do MedPharma a partir de **fontes abertas/oficiais**, de forma
legítima (sem violar direitos autorais).

## ⚠️ O que pode e o que não pode
- ✅ **Pode:** nomes de princípio ativo (DCB), classe terapêutica, código ATC —
  são **fatos públicos** disponíveis em fontes abertas/oficiais.
- ❌ **Não pode:** copiar conteúdo de bases **proprietárias** (Micromedex,
  Medscape, Drugs.com) nem o **texto integral de bulas** (direito autoral dos
  fabricantes) para uma ferramenta pública.

## Fontes recomendadas (gratuitas/oficiais)
- **Dados abertos da Anvisa** — dados.gov.br (medicamentos registrados / DCB).
- **RENAME** (Relação Nacional de Medicamentos Essenciais) — Ministério da Saúde.
- **MedSUS** — app/base oficial do Ministério da Saúde.
- **Bulário Eletrônico da Anvisa** — para CONSULTA/validação humana (não para cópia
  automática do texto das bulas).

## Como usar
1. Baixe um CSV de uma fonte oficial (ex.: RENAME ou dados abertos Anvisa).
2. Descubra os nomes das colunas (abra o CSV) — princípio ativo e, se houver, classe.
3. Rode o conversor:
   ```bash
   python3 tools/opendata/csv_to_catalog.py \
     --csv caminho/arquivo.csv \
     --col-ai "PRINCIPIO_ATIVO" \
     --col-tc "CLASSE_TERAPEUTICA" \
     --delimiter ";" --encoding "utf-8"
   ```
   Isso grava `prisma/medicamentos-oficiais.ts` (deduplicado).
4. Publique:
   ```bash
   git add . ; git commit -m "Importa base oficial de medicamentos" ; git push
   ```
   O deploy automático sincroniza os novos medicamentos no banco (sem apagar dados),
   entrando como **não validados** (campos clínicos pendentes de curadoria).

## Observações
- Os novos itens entram com `reviewed=false` — nomes/classes prontos; posologia,
  interações e RAM devem ser curados por farmacêutico.
- Interações continuam sendo curadas manualmente (arquivos `prisma/interacoes-base*.ts`),
  pois exigem validação clínica — é o diferencial da ferramenta.
