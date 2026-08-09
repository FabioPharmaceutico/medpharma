import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft, Baby, Activity, HeartPulse, Ban, AlertTriangle, Droplets,
  FlaskConical, Utensils, Users, Pill, Target, Package, Archive, ShieldAlert, ShieldCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { getDrug } from "@/actions/drugs";

type RAM = { frequency: string; reactions: string[] };

function parseRAM(json: string | null): RAM[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export default async function DrugDetailPage({ params }: { params: { id: string } }) {
  const drug = await getDrug(params.id);
  if (!drug) notFound();

  const ram = parseRAM(drug.adverseReactions);
  type Sev = "HIGH" | "MEDIUM" | "LOW";
  const related = [
    ...drug.interactionsA.map((i) => ({ id: i.id, severity: i.severity as Sev, other: i.drugB })),
    ...drug.interactionsB.map((i) => ({ id: i.id, severity: i.severity as Sev, other: i.drugA })),
  ];

  return (
    <div className="space-y-6">
      <Link href="/medicamentos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Voltar à busca
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Pill className="h-6 w-6" />
          </span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{drug.activeIngredient}</h1>
            <p className="text-sm text-muted-foreground">
              {drug.name} · {drug.therapeuticClass}{drug.atcCode ? ` · ATC ${drug.atcCode}` : ""}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {drug.pregnancyCategory && <Badge variant="outline">Gestação {drug.pregnancyCategory}</Badge>}
          {drug.reviewed ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-severity-low/30 bg-severity-low/15 px-2.5 py-0.5 text-xs font-semibold text-severity-low">
              <ShieldCheck className="h-3.5 w-3.5" /> Validado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full border border-severity-high/30 bg-severity-high/15 px-2.5 py-0.5 text-xs font-semibold text-severity-high">
              <ShieldAlert className="h-3.5 w-3.5" /> Não validado
            </span>
          )}
        </div>
      </div>

      {!drug.reviewed && (
        <div className="flex items-start gap-2 rounded-md border border-severity-high/30 bg-severity-high/10 p-3 text-xs text-severity-high">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Registro importado por OCR do bulário e <strong>ainda não validado</strong> por farmacêutico.
            Pode conter erros de extração. Revise em <strong>Importação</strong> antes de usar clinicamente.
            {drug.sourceRef ? ` Fonte: ${drug.sourceRef}.` : ""}
          </p>
        </div>
      )}

      {drug.description && <p className="text-sm text-muted-foreground">{drug.description}</p>}

      {drug.indications && <Field icon={Target} title="Indicações">{drug.indications}</Field>}

      {drug.standardPosology && (
        <Field icon={Activity} title="Posologia padrão">{drug.standardPosology}</Field>
      )}

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Users className="h-4 w-4 text-primary" /> Ajustes em populações especiais
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Pop icon={Droplets} title="Ajuste renal" value={drug.renalAdjustment} />
          <Pop icon={HeartPulse} title="Ajuste hepático" value={drug.hepaticAdjustment} />
          <Pop icon={Users} title="Geriátrico" value={drug.geriatricNotes} />
          <Pop icon={Baby} title="Pediátrico" value={drug.pediatricNotes} />
          <Pop icon={Baby} title="Gestação" value={drug.pregnancyCategory ? `Categoria ${drug.pregnancyCategory}` : null} />
          <Pop icon={Droplets} title="Lactação" value={drug.lactation} />
        </CardContent>
      </Card>

      {drug.contraindications && (
        <Card className="border-severity-high/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-severity-high">
              <Ban className="h-4 w-4" /> Contraindicações
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{drug.contraindications}</CardContent>
        </Card>
      )}

      {ram.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-severity-medium" /> Reações adversas (RAM) por frequência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {ram.map((r) => (
              <div key={r.frequency}>
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{r.frequency}</div>
                <div className="flex flex-wrap gap-1.5">
                  {r.reactions.map((x) => (
                    <Badge key={x} variant="secondary" className="font-normal">{x}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {ram.length === 0 && drug.adverseReactions && (
        <Field icon={AlertTriangle} title="Reações adversas">{drug.adverseReactions}</Field>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {drug.foodInteractions && <Field icon={Utensils} title="Interações com alimentos">{drug.foodInteractions}</Field>}
        {drug.labInteractions && <Field icon={FlaskConical} title="Monitorização / exames">{drug.labInteractions}</Field>}
        {drug.presentations && <Field icon={Package} title="Apresentações">{drug.presentations}</Field>}
        {drug.storage && <Field icon={Archive} title="Armazenamento">{drug.storage}</Field>}
      </div>

      {related.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Interações medicamentosas cadastradas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/medicamentos/${r.other.id}`}
                className="flex items-center justify-between rounded-md border p-3 text-sm transition-colors hover:border-primary/60"
              >
                <span className="font-medium">{r.other.activeIngredient} <span className="text-muted-foreground">({r.other.name})</span></span>
                <SeverityBadge severity={r.severity} />
              </Link>
            ))}
            <Link href="/interacoes" className="pt-1 text-xs font-medium text-primary hover:underline">
              Abrir checador multidrogas →
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className="h-4 w-4 text-primary" /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="text-sm">{children}</CardContent>
    </Card>
  );
}

function Pop({ icon: Icon, title, value }: { icon: any; title: string; value: string | null }) {
  return (
    <div className="rounded-md border p-3">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {title}
      </div>
      <div className="text-sm">{value || <span className="text-muted-foreground">Sem ajuste específico informado</span>}</div>
    </div>
  );
}
