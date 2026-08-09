import { ImportReview } from "@/components/import-review";
import { listPendingImports } from "@/actions/import";
import { ShieldAlert } from "lucide-react";

export const metadata = { title: "Importação do Bulário" };
export const dynamic = "force-dynamic";

export default async function ImportacaoPage() {
  let items: any[] = [];
  try {
    items = await listPendingImports();
  } catch {
    // banco indisponível
  }
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Importação do Bulário — Fila de Revisão</h1>
        <p className="text-sm text-muted-foreground">
          Registros extraídos por OCR do bulário. Cada item precisa ser conferido e aprovado por
          farmacêutico antes de entrar na Consulta como dado validado.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-severity-high/30 bg-severity-high/10 p-3 text-xs text-severity-high">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          <strong>Direitos autorais:</strong> o &quot;Bulário Explicativo&quot; é obra protegida. A extração
          destina-se a uso pessoal/interno de referência. Incorporar o conteúdo em produto distribuído
          ou comercializado exige autorização da editora. <strong>OCR pode conter erros</strong> —
          confira contra a fonte oficial antes de aprovar.
        </p>
      </div>

      <ImportReview initial={items} />
    </div>
  );
}
