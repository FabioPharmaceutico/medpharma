"use server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

export const suggestionCategories = ["DICA", "CRITICA", "SUGESTAO"] as const;

const schema = z.object({
  name: z.string().max(120).optional().nullable(),
  email: z.string().email("E-mail inválido").max(160).optional().or(z.literal("")).nullable(),
  category: z.enum(suggestionCategories).default("SUGESTAO"),
  message: z.string().min(5, "Escreva ao menos 5 caracteres").max(3000),
});

export type SuggestionInput = z.infer<typeof schema>;
export type FeedbackState = { ok: boolean; message?: string };

export async function createSuggestion(raw: SuggestionInput): Promise<FeedbackState> {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }
  const d = parsed.data;
  try {
    await prisma.suggestion.create({
      data: {
        name: d.name?.trim() || null,
        email: d.email?.trim() || null,
        category: d.category,
        message: d.message.trim(),
      },
    });
    return { ok: true, message: "Obrigado! Sua mensagem foi enviada ao desenvolvedor." };
  } catch {
    return { ok: false, message: "Não foi possível enviar agora. Tente novamente em instantes." };
  }
}

// Leitura restrita ao administrador via chave (env ADMIN_KEY). Sem a chave correta,
// nada é retornado — protege as mensagens sem exigir sistema de login.
export async function listSuggestions(key: string) {
  const admin = process.env.ADMIN_KEY;
  if (!admin || key !== admin) return null;
  return prisma.suggestion.findMany({ orderBy: { createdAt: "desc" }, take: 500 });
}
