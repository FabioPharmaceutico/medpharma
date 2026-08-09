// Tipos de domínio (uniões) independentes do provider do banco.
// Mantidos localmente para que o código funcione tanto com enums nativos
// (PostgreSQL) quanto com colunas String (SQLite, para dev local sem Docker).

export type Severity = "HIGH" | "MEDIUM" | "LOW";
export type DrugSource = "MANUAL" | "BULARIO_OCR";
export type PrmType =
  | "DOSAGEM_INADEQUADA"
  | "INEFETIVIDADE"
  | "RAM"
  | "INTERACAO"
  | "NAO_ADESAO"
  | "DUPLICIDADE"
  | "INDICACAO_NAO_TRATADA";
export type DoctorAcceptance = "ACCEPTED" | "REJECTED" | "ACCEPTED_MODIFIED" | "PENDING";
export type InterventionStatus = "RESOLVED" | "MONITORING" | "UNRESOLVED";
