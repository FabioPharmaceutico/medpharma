"use client";
import * as React from "react";
import { toast } from "sonner";
import { FileDown, Plus, Trash2, ClipboardList, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { interventionSchema } from "@/lib/validations";
import { PRM_LABELS, ACCEPTANCE_LABELS, STATUS_LABELS } from "@/lib/labels";
import { createIntervention, deleteIntervention } from "@/actions/interventions";
import { generateInterventionPdf } from "@/lib/intervention-pdf";

type DrugOpt = { id: string; activeIngredient: string; name: string };
type Item = {
  id: string; patientRef: string; drugId: string | null; drugName: string | null;
  prmType: string; description: string; recommendation: string;
  doctorAcceptance: string; status: string; author: string | null; createdAt: string | Date;
  drug?: { activeIngredient: string; name: string } | null;
  notes?: { text: string; author: string | null; createdAt: string | Date }[];
};

const empty = {
  patientRef: "", drugId: "", drugName: "", prmType: "INTERACAO",
  description: "", recommendation: "", doctorAcceptance: "PENDING", status: "MONITORING", author: "",
};

export function InterventionManager({ drugs, initial }: { drugs: DrugOpt[]; initial: Item[] }) {
  const [items, setItems] = React.useState<Item[]>(initial);
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = React.useState({ ...empty });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [pending, startTransition] = React.useTransition();

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const drugLabelOf = (it: Item) =>
    it.drug ? `${it.drug.activeIngredient} (${it.drug.name})` : it.drugName || "—";

  const submit = () => {
    const payload = {
      ...form,
      drugId: form.drugId || null,
      drugName: form.drugName || (form.drugId ? drugs.find((d) => d.id === form.drugId)?.activeIngredient ?? null : null),
    };
    const parsed = interventionSchema.safeParse(payload);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const i of parsed.error.issues) { const k = i.path[0]?.toString() ?? "form"; if (!fe[k]) fe[k] = i.message; }
      setErrors(fe);
      toast.error("Corrija os campos destacados.");
      return;
    }
    setErrors({});
    startTransition(async () => {
      const res = await createIntervention(parsed.data);
      if (res.ok) {
        toast.success(res.message ?? "Registrado.");
        const chosen = drugs.find((d) => d.id === form.drugId);
        setItems((p) => [
          {
            id: `tmp-${Date.now()}`, patientRef: parsed.data.patientRef,
            drugId: parsed.data.drugId ?? null, drugName: parsed.data.drugName ?? null,
            prmType: parsed.data.prmType, description: parsed.data.description,
            recommendation: parsed.data.recommendation, doctorAcceptance: parsed.data.doctorAcceptance,
            status: parsed.data.status, author: parsed.data.author ?? null, createdAt: new Date(),
            drug: chosen ? { activeIngredient: chosen.activeIngredient, name: chosen.name } : null, notes: [],
          },
          ...p,
        ]);
        setForm({ ...empty });
        setOpen(false);
      } else {
        toast.error(res.message ?? "Erro ao salvar.");
        if (res.fieldErrors) setErrors(res.fieldErrors);
      }
    });
  };

  const onDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteIntervention(id);
      if (res.ok || id.startsWith("tmp-")) {
        setItems((p) => p.filter((x) => x.id !== id));
        toast.success("Intervenção excluída.");
      } else toast.error(res.message ?? "Erro.");
    });
  };

  const exportPdf = (it: Item) => {
    generateInterventionPdf({
      id: it.id, patientRef: it.patientRef, drugLabel: drugLabelOf(it),
      prmType: it.prmType, description: it.description, recommendation: it.recommendation,
      doctorAcceptance: it.doctorAcceptance, status: it.status, author: it.author, createdAt: it.createdAt,
      notes: it.notes,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4" /> Nova intervenção</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl">
            <DialogHeader><DialogTitle>Registrar intervenção farmacêutica</DialogTitle></DialogHeader>
            <div className="grid gap-4">
              <Field label="Identificação do paciente (ID anônimo — LGPD)" error={errors.patientRef}>
                <Input value={form.patientRef} onChange={(e) => set("patientRef", e.target.value)} placeholder="Ex.: PAC-0001 / prontuário interno" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Medicamento (cadastro)">
                  <Select value={form.drugId} onValueChange={(v) => set("drugId", v)}>
                    <SelectTrigger><SelectValue placeholder="Selecionar…" /></SelectTrigger>
                    <SelectContent>
                      {drugs.map((d) => (
                        <SelectItem key={d.id} value={d.id}>{d.activeIngredient} · {d.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="…ou medicamento (texto livre)">
                  <Input value={form.drugName} onChange={(e) => set("drugName", e.target.value)} placeholder="Se fora do cadastro" />
                </Field>
              </div>

              <Field label="Tipo de PRM (Dáder/Granada)" error={errors.prmType}>
                <Select value={form.prmType} onValueChange={(v) => set("prmType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(PRM_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Descrição do problema" error={errors.description}>
                <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} />
              </Field>
              <Field label="Intervenção realizada" error={errors.recommendation}>
                <Textarea value={form.recommendation} onChange={(e) => set("recommendation", e.target.value)} rows={3} placeholder="Ex.: sugestão de substituição, ajuste de aprazamento, descontinuação…" />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Aceitabilidade">
                  <Select value={form.doctorAcceptance} onValueChange={(v) => set("doctorAcceptance", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(ACCEPTANCE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={form.status} onValueChange={(v) => set("status", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <Field label="Farmacêutico responsável (opcional)">
                <Input value={form.author} onChange={(e) => set("author", e.target.value)} placeholder="Nome / CRF" />
              </Field>
            </div>
            <DialogFooter>
              <DialogClose asChild><Button variant="ghost">Cancelar</Button></DialogClose>
              <Button onClick={submit} disabled={pending}>{pending ? "Salvando…" : "Salvar intervenção"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 && (
        <div className="flex h-40 flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground">
          <ClipboardList className="h-6 w-6" /> Nenhuma intervenção registrada ainda.
        </div>
      )}

      <div className="grid gap-3">
        {items.map((it) => (
          <Card key={it.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="h-4 w-4 text-primary" /> {it.patientRef}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <StatusBadge status={it.status} />
                  <Badge variant="outline">{ACCEPTANCE_LABELS[it.doctorAcceptance]}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="secondary">{PRM_LABELS[it.prmType]}</Badge>
                <Badge variant="outline">{drugLabelOf(it)}</Badge>
                <span className="text-muted-foreground">{new Date(it.createdAt).toLocaleString("pt-BR")}</span>
              </div>
              <p><span className="font-semibold">Problema: </span>{it.description}</p>
              <p className="rounded-md bg-primary/5 p-2"><span className="font-semibold">Intervenção: </span>{it.recommendation}</p>
              <div className="flex justify-end gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => exportPdf(it)}>
                  <FileDown className="h-4 w-4" /> PDF
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDelete(it.id)} disabled={pending}>
                  <Trash2 className="h-4 w-4" /> Excluir
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cls =
    status === "RESOLVED" ? "bg-severity-low/15 text-severity-low border-severity-low/30" :
    status === "UNRESOLVED" ? "bg-severity-high/15 text-severity-high border-severity-high/30" :
    "bg-severity-medium/15 text-severity-medium border-severity-medium/30";
  return <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{STATUS_LABELS[status]}</span>;
}
