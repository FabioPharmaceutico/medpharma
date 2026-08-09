import { InterventionManager } from "@/components/intervention-manager";
import { ClinicalDisclaimer } from "@/components/clinical-disclaimer";
import { listInterventions } from "@/actions/interventions";
import { listAllDrugsMinimal } from "@/actions/drugs";

export const metadata = { title: "Intervenções Farmacêuticas" };
export const dynamic = "force-dynamic";

export default async function IntervencoesPage() {
  let drugs: any[] = [];
  let items: any[] = [];
  try {
    [drugs, items] = await Promise.all([listAllDrugsMinimal(), listInterventions()]);
  } catch {
    // banco indisponível — página ainda renderiza
  }
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Intervenções Farmacêuticas</h1>
        <p className="text-sm text-muted-foreground">
          Registro de PRM (classificação Dáder/Granada), aceitabilidade médica e status, com exportação
          de relatório em PDF para anexo ao prontuário.
        </p>
      </div>
      <ClinicalDisclaimer />
      <InterventionManager drugs={drugs} initial={items} />
    </div>
  );
}
