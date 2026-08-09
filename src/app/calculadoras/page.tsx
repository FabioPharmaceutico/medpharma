import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CockcroftGault } from "@/components/calculators/cockcroft-gault";
import { PediatricDose } from "@/components/calculators/pediatric-dose";
import { CorticoidConversion } from "@/components/calculators/corticoid-conversion";
import { GeriatricModule } from "@/components/calculators/geriatric";
import { ClinicalDisclaimer } from "@/components/clinical-disclaimer";

export const metadata = { title: "Calculadoras Clínicas" };

export default function CalculadorasPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Calculadoras Clínicas Farmacêuticas</h1>
        <p className="text-sm text-muted-foreground">
          Ferramentas de apoio para ajuste de dose e conversões. Validação de entrada com Zod.
        </p>
      </div>
      <ClinicalDisclaimer />
      <Tabs defaultValue="clcr">
        <TabsList>
          <TabsTrigger value="clcr">Clearance (CG)</TabsTrigger>
          <TabsTrigger value="ped">Dose pediátrica</TabsTrigger>
          <TabsTrigger value="cort">Corticoides</TabsTrigger>
          <TabsTrigger value="idosos">Idosos</TabsTrigger>
        </TabsList>
        <TabsContent value="clcr"><CockcroftGault /></TabsContent>
        <TabsContent value="ped"><PediatricDose /></TabsContent>
        <TabsContent value="cort"><CorticoidConversion /></TabsContent>
        <TabsContent value="idosos"><GeriatricModule /></TabsContent>
      </Tabs>
    </div>
  );
}
