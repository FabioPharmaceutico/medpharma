import { InteractionChecker } from "@/components/interaction-checker";
import { ClinicalDisclaimer } from "@/components/clinical-disclaimer";

export const metadata = { title: "Checagem de Interações" };

export default function InteracoesPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Checagem Multidrogas de Interações</h1>
        <p className="text-sm text-muted-foreground">
          Monte a lista de medicamentos do paciente e visualize a matriz de interações por severidade,
          com mecanismo, efeito clínico e conduta farmacêutica.
        </p>
      </div>
      <ClinicalDisclaimer />
      <InteractionChecker />
    </div>
  );
}
