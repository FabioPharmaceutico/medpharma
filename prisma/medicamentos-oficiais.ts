// Medicamentos importados de FONTES ABERTAS/OFICIAIS (dados abertos Anvisa,
// RENAME, MedSUS). Este arquivo é PREENCHIDO automaticamente pelo conversor
// em tools/opendata/csv_to_catalog.py a partir de um CSV oficial que você baixa.
//
// Enquanto vazio, não afeta o catálogo. Após rodar o conversor, os novos
// medicamentos entram no catálogo (via seed → sincronização) no próximo deploy.
import type { BaseDrug } from "./medicamentos-base";

export const MEDICAMENTOS_OFICIAIS: BaseDrug[] = [];
