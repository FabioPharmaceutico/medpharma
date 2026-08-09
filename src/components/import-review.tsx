"use client";
import * as React from "react";
import { toast } from "sonner";
import { Check, Trash2, FileText, ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { approveImport, rejectImport, type ReviewEdits } from "@/actions/import";

type Item = {
  id: string; activeIngredient: string; name: string; therapeuticClass: string;
  pregnancyCategory: string | null; standardPosology: string | null; indications: string | null;
  contraindications: string | null; adverseReactions: string | null; storage: string | null;
  presentations: string | null; rawText: string | null; sourceRef: string | null; sourcePage: number | null;
};

export function ImportReview({ initial }: { initial: Item[] }) {
  const [items, setItems] = React.useState(initial);
  const [reviewer, setReviewer] = React.useState("");
  const [openId, setOpenId] = React.useState<string | null>(initial[0]?.id ?? null);
  const [pending, startTransition] = React.useTransition();

  if (items.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground">
        <BookOpen className="h-6 w-6" /> Nenhum registro do bulário pendente de revisão.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-1.5 sm:max-w-xs">
        <Label>Farmacêutico revisor (CRF)</Label>
        <Input value={reviewer} onChange={(e) => setReviewer(e.target.value)} placeholder="Nome / CRF" />
      </div>

      <p className="text-sm text-muted-foreground">
        {items.length} registro(s) pendente(s). Ao aprovar, o item passa a valer como dado
        <strong> validado</strong> e aparece na Consulta. Confira sempre contra a fonte oficial.
      </p>

      {items.map((it) => (
        <ReviewCard
          key={it.id}
          item={it}
          open={openId === it.id}
          onToggle={() => setOpenId(openId === it.id ? null : it.id)}
          disabled={pending}
          onApprove={(edits) =>
            startTransition(async () => {
              const res = await approveImport(it.id, edits, reviewer);
              if (res.ok) { toast.success(`"${edits.activeIngredient}" aprovado.`); setItems((p) => p.filter((x) => x.id !== it.id)); }
              else toast.error(res.message ?? "Erro ao aprovar.");
            })
          }
          onReject={() =>
            startTransition(async () => {
              const res = await rejectImport(it.id);
              if (res.ok) { toast.success("Registro descartado."); setItems((p) => p.filter((x) => x.id !== it.id)); }
              else toast.error(res.message ?? "Erro.");
            })
          }
        />
      ))}
    </div>
  );
}

function ReviewCard({
  item, open, onToggle, onApprove, onReject, disabled,
}: {
  item: Item; open: boolean; onToggle: () => void; disabled: boolean;
  onApprove: (e: ReviewEdits) => void; onReject: () => void;
}) {
  const [f, setF] = React.useState({
    activeIngredient: item.activeIngredient, name: item.name,
    therapeuticClass: item.therapeuticClass === "(a classificar)" ? "" : item.therapeuticClass,
    pregnancyCategory: item.pregnancyCategory ?? "",
    standardPosology: item.standardPosology ?? "", indications: item.indications ?? "",
    contraindications: item.contraindications ?? "", adverseReactions: item.adverseReactions ?? "",
    storage: item.storage ?? "", presentations: item.presentations ?? "",
  });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Card>
      <CardHeader className="cursor-pointer pb-3" onClick={onToggle}>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base">
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            {item.activeIngredient}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" /> OCR</Badge>
            {item.sourceRef && <span className="hidden text-xs text-muted-foreground sm:inline">{item.sourceRef}</span>}
          </div>
        </div>
      </CardHeader>
      {open && (
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldI label="Princípio ativo" v={f.activeIngredient} on={(v) => set("activeIngredient", v)} />
            <FieldI label="Nome/apresentação" v={f.name} on={(v) => set("name", v)} />
            <FieldI label="Classe terapêutica" v={f.therapeuticClass} on={(v) => set("therapeuticClass", v)} placeholder="Classificar" />
            <FieldI label="Gestação (A/B/C/D/X)" v={f.pregnancyCategory} on={(v) => set("pregnancyCategory", v)} />
          </div>
          <FieldT label="Indicações" v={f.indications} on={(v) => set("indications", v)} />
          <FieldT label="Posologia" v={f.standardPosology} on={(v) => set("standardPosology", v)} />
          <FieldT label="Contraindicações" v={f.contraindications} on={(v) => set("contraindications", v)} />
          <FieldT label="Reações adversas" v={f.adverseReactions} on={(v) => set("adverseReactions", v)} />
          <div className="grid gap-3 sm:grid-cols-2">
            <FieldT label="Apresentações" v={f.presentations} on={(v) => set("presentations", v)} rows={2} />
            <FieldT label="Armazenamento" v={f.storage} on={(v) => set("storage", v)} rows={2} />
          </div>

          {item.rawText && (
            <details className="rounded-md border bg-muted/30 p-3 text-xs">
              <summary className="cursor-pointer font-medium text-muted-foreground">Texto OCR bruto (auditoria)</summary>
              <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{item.rawText}</p>
            </details>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={onReject} disabled={disabled}>
              <Trash2 className="h-4 w-4" /> Descartar
            </Button>
            <Button
              size="sm"
              disabled={disabled || !f.activeIngredient || !f.therapeuticClass}
              onClick={() => onApprove({
                activeIngredient: f.activeIngredient.trim(),
                name: f.name.trim() || f.activeIngredient.trim(),
                therapeuticClass: f.therapeuticClass.trim(),
                pregnancyCategory: f.pregnancyCategory.trim() || null,
                standardPosology: f.standardPosology.trim() || null,
                indications: f.indications.trim() || null,
                contraindications: f.contraindications.trim() || null,
                adverseReactions: f.adverseReactions.trim() || null,
                storage: f.storage.trim() || null,
                presentations: f.presentations.trim() || null,
              })}
            >
              <Check className="h-4 w-4" /> Aprovar como validado
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function FieldI({ label, v, on, placeholder }: { label: string; v: string; on: (v: string) => void; placeholder?: string }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input value={v} onChange={(e) => on(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
function FieldT({ label, v, on, rows = 3 }: { label: string; v: string; on: (v: string) => void; rows?: number }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Textarea value={v} onChange={(e) => on(e.target.value)} rows={rows} />
    </div>
  );
}
