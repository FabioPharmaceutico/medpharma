import { z } from "zod";

export const prmTypes = [
  "DOSAGEM_INADEQUADA",
  "INEFETIVIDADE",
  "RAM",
  "INTERACAO",
  "NAO_ADESAO",
  "DUPLICIDADE",
  "INDICACAO_NAO_TRATADA",
] as const;

export const doctorAcceptances = ["ACCEPTED", "REJECTED", "ACCEPTED_MODIFIED", "PENDING"] as const;
export const interventionStatuses = ["RESOLVED", "MONITORING", "UNRESOLVED"] as const;

export const interventionSchema = z.object({
  patientRef: z
    .string()
    .min(1, "Informe o identificador anônimo do paciente (LGPD)")
    .max(60, "Máximo de 60 caracteres"),
  drugId: z.string().optional().nullable(),
  drugName: z.string().max(120).optional().nullable(),
  prmType: z.enum(prmTypes, { errorMap: () => ({ message: "Selecione o tipo de PRM" }) }),
  description: z.string().min(5, "Descreva o problema (mín. 5 caracteres)").max(2000),
  recommendation: z.string().min(5, "Descreva a intervenção (mín. 5 caracteres)").max(2000),
  doctorAcceptance: z.enum(doctorAcceptances).default("PENDING"),
  status: z.enum(interventionStatuses).default("MONITORING"),
  author: z.string().max(120).optional().nullable(),
});

export type InterventionInput = z.infer<typeof interventionSchema>;

// ---- Calculadoras ----
export const cockcroftSchema = z.object({
  age: z.coerce.number().int().min(1, "Idade inválida").max(120),
  weightKg: z.coerce.number().min(1, "Peso inválido").max(400),
  serumCreatinine: z.coerce.number().min(0.1, "Creatinina inválida").max(20),
  sex: z.enum(["M", "F"]),
});

export const pediatricDoseSchema = z.object({
  weightKg: z.coerce.number().min(0.5, "Peso inválido").max(150),
  mgPerKgPerDay: z.coerce.number().min(0.01, "Valor inválido").max(500),
  dosesPerDay: z.coerce.number().int().min(1).max(6),
  concentrationMgPerMl: z.coerce.number().min(0.01).max(1000).optional(),
  maxMgPerDay: z.coerce.number().min(0).max(100000).optional(),
});

export const corticoidSchema = z.object({
  fromDrug: z.string(),
  toDrug: z.string(),
  doseMg: z.coerce.number().min(0.1, "Dose inválida").max(10000),
});
