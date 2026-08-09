import { DrugSearch } from "@/components/drug-search";
import { ClinicalDisclaimer } from "@/components/clinical-disclaimer";

export const metadata = { title: "Consulta de Medicamentos" };

export default function MedicamentosPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Consulta de Medicamentos</h1>
        <p className="text-sm text-muted-foreground">
          Busca inteligente em tempo real por princípio ativo (DCB/INN), nome comercial ou classe terapêutica.
        </p>
      </div>
      <ClinicalDisclaimer />
      <DrugSearch />
    </div>
  );
}
