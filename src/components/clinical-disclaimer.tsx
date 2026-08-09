import { ShieldAlert } from "lucide-react";

export function ClinicalDisclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-severity-medium/30 bg-severity-medium/10 p-3 text-xs text-severity-medium">
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
      <p className={compact ? "" : "leading-relaxed"}>
        Ferramenta de <strong>apoio à decisão</strong>. Não substitui o julgamento clínico, a bula
        oficial (Anvisa) nem referências primárias. Dados do seed são <strong>ilustrativos</strong> e
        devem ser validados por farmacêutico responsável antes de uso assistencial.
      </p>
    </div>
  );
}
