"use client";
import { AlertTriangle, ShieldAlert, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CockcroftGault } from "@/components/calculators/cockcroft-gault";

type RiskItem = {
  grupo: string;
  exemplos: string;
  risco: string;
  conduta: string;
  sev: "high" | "medium";
};

// Medicamentos potencialmente inapropriados / de atenção no idoso.
// Redigido a partir de critérios amplamente consagrados (linha Beers/STOPP),
// com texto próprio — não reproduz o documento proprietário. Referência clínica.
const RISCOS: RiskItem[] = [
  { grupo: "Benzodiazepínicos", exemplos: "diazepam, clonazepam, bromazepam, midazolam", risco: "Sedação, confusão, quedas e fraturas; risco aumentado de delirium.", conduta: "Evitar; se imprescindível, menor dose e curta duração. Desprescrever gradualmente.", sev: "high" },
  { grupo: "Anticolinérgicos", exemplos: "amitriptilina, oxibutinina, prometazina, dexclorfeniramina, escopolamina", risco: "Confusão, retenção urinária, constipação, boca seca, visão turva, quedas.", conduta: "Preferir alternativas sem ação anticolinérgica; somar a 'carga anticolinérgica' total.", sev: "high" },
  { grupo: "AINEs", exemplos: "ibuprofeno, diclofenaco, naproxeno, cetorolaco", risco: "Sangramento gastrointestinal, lesão renal aguda, retenção hídrica, ↑PA.", conduta: "Evitar uso crônico; preferir paracetamol; se usar, menor tempo + gastroproteção.", sev: "high" },
  { grupo: "Sulfonilureias de longa ação", exemplos: "glibenclamida", risco: "Hipoglicemia prolongada e grave.", conduta: "Preferir gliclazida ou outras classes; monitorar glicemia.", sev: "high" },
  { grupo: "Antipsicóticos", exemplos: "haloperidol, risperidona, quetiapina, olanzapina", risco: "↑mortalidade e AVC em idosos com demência; sedação, quedas, sintomas extrapiramidais.", conduta: "Evitar para sintomas de demência; usar só com indicação clara, menor dose e reavaliação.", sev: "high" },
  { grupo: "Antidepressivos tricíclicos", exemplos: "amitriptilina, nortriptilina, clomipramina, imipramina", risco: "Efeito anticolinérgico, hipotensão ortostática, arritmia.", conduta: "Preferir ISRS/IRSN quando indicado.", sev: "medium" },
  { grupo: "Relaxantes musculares", exemplos: "ciclobenzaprina, orfenadrina, carisoprodol", risco: "Sedação, efeito anticolinérgico, quedas; eficácia questionável no idoso.", conduta: "Evitar; medidas não farmacológicas e alternativas.", sev: "medium" },
  { grupo: "Digoxina (dose alta)", exemplos: "digoxina > 0,125 mg/dia", risco: "Estreita janela terapêutica; intoxicação (mais provável na função renal reduzida).", conduta: "Usar menor dose eficaz; monitorar nível, K+ e função renal.", sev: "medium" },
  { grupo: "IBP (uso prolongado)", exemplos: "omeprazol, pantoprazol, esomeprazol", risco: "Hipomagnesemia, deficiência de B12, fraturas, infecção por C. difficile.", conduta: "Reavaliar a indicação periodicamente; menor tempo possível.", sev: "medium" },
  { grupo: "Alfabloqueadores para hipertensão", exemplos: "doxazosina, prazosina", risco: "Hipotensão ortostática e quedas.", conduta: "Evitar como anti-hipertensivo de rotina no idoso.", sev: "medium" },
];

export function GeriatricModule() {
  return (
    <div className="space-y-5">
      <Card className="border-primary/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" /> Ajuste de dose no idoso — função renal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            No idoso, a creatinina sérica pode <strong>subestimar</strong> a perda de função renal (menor massa
            muscular). Estime o clearance para ajustar fármacos de eliminação renal (ex.: digoxina, metformina,
            enoxaparina, alguns antibióticos e anticoagulantes orais diretos).
          </p>
          <CockcroftGault />
        </CardContent>
      </Card>

      <Card className="border-severity-high/30">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base text-severity-high">
            <ShieldAlert className="h-4 w-4" /> Medicamentos potencialmente inapropriados no idoso
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs text-muted-foreground">
            Referência de atenção (linha Beers/STOPP, redigida com texto próprio). Não substitui avaliação
            individual — considere indicação, benefício e alternativas. Em <strong>polifarmácia</strong>, use também
            a aba <strong>Interações</strong> para checar a lista completa do paciente.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {RISCOS.map((r) => (
              <div
                key={r.grupo}
                className={`rounded-lg border p-3 ${
                  r.sev === "high" ? "border-severity-high/30 bg-severity-high/5" : "border-severity-medium/30 bg-severity-medium/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${r.sev === "high" ? "text-severity-high" : "text-severity-medium"}`} />
                  <span className="font-semibold">{r.grupo}</span>
                </div>
                <p className="mt-1 text-xs italic text-muted-foreground">{r.exemplos}</p>
                <p className="mt-2 text-sm"><span className="font-medium">Risco:</span> {r.risco}</p>
                <p className="mt-1 text-sm"><span className="font-medium">Conduta:</span> {r.conduta}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
