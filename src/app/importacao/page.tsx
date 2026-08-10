import { ImportReview } from "@/components/import-review";
import { listPendingImports } from "@/actions/import";
import { ShieldAlert } from "lucide-react";

export const metadata = { title: "Validação de Conteúdo" };
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
        <h1 className="text-2xl font-bold tracking-tight">Validação de Conteúdo — Fila de Revisão</h1>
        <p className="text-sm text-muted-foreground">
          Rascunhos de conteúdo clínico (curadoria assistida) e itens de OCR do bulário. Cada item
          precisa ser conferido, editado se necessário e <strong>aprovado por farmacêutico</strong> antes
          de aparecer como <strong>Validado</strong> na Consulta.
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-md border border-severity-medium/30 bg-severity-medium/10 p-3 text-xs text-severity-medium">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Os rascunhos foram redigidos a partir de fatos consolidados e fontes abertas/oficiais
          (não reproduzem bases proprietárias). <strong>Confira sempre contra a bula oficial (Anvisa)</strong>
          antes de aprovar — posologias e contraindicações exigem verificação clínica.
        </p>
      </div>

      {items.length > 0 && (
        <p className="text-sm font-medium">{items.length} item(ns) pendente(s) de validação.</p>
      )}

      <ImportReview initial={items} />
    </div>
  );
}
