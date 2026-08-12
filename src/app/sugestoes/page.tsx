import { SuggestionForm } from "@/components/suggestion-form";
import { MessageSquareHeart } from "lucide-react";

export const metadata = { title: "Sugestões e Contato" };

export default function SugestoesPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <MessageSquareHeart className="h-6 w-6 text-primary" /> Fale com o desenvolvedor
        </h1>
        <p className="text-sm text-muted-foreground">
          O MedPharma é gratuito e evolui com a comunidade. Envie suas <strong>dicas, críticas e
          sugestões</strong> — inclusive correções de conteúdo clínico. Sua contribuição ajuda a
          tornar a ferramenta mais útil e segura para todos os profissionais.
        </p>
      </div>
      <SuggestionForm />
      <p className="text-center text-xs text-muted-foreground">
        Desenvolvido por Fábio Rogério de Oliveira da Cunha — Farmacêutico-Bioquímico (CRF-GO/CRF-SP).
      </p>
    </div>
  );
}
