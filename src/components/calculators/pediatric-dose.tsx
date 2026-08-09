"use client";
import * as React from "react";
import { Baby } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { pediatricDoseSchema } from "@/lib/validations";

export function PediatricDose() {
  const [f, setF] = React.useState({ weightKg: "", mgPerKgPerDay: "", dosesPerDay: "2", concentrationMgPerMl: "", maxMgPerDay: "" });
  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  const parsed = pediatricDoseSchema.safeParse({
    weightKg: f.weightKg, mgPerKgPerDay: f.mgPerKgPerDay, dosesPerDay: f.dosesPerDay,
    concentrationMgPerMl: f.concentrationMgPerMl || undefined, maxMgPerDay: f.maxMgPerDay || undefined,
  });

  let totalMgDay = 0, perDoseMg = 0, capped = false, perDoseMl: number | null = null;
  if (parsed.success) {
    const d = parsed.data;
    totalMgDay = d.weightKg * d.mgPerKgPerDay;
    if (d.maxMgPerDay && totalMgDay > d.maxMgPerDay) { totalMgDay = d.maxMgPerDay; capped = true; }
    perDoseMg = totalMgDay / d.dosesPerDay;
    if (d.concentrationMgPerMl) perDoseMl = perDoseMg / d.concentrationMgPerMl;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Baby className="h-4 w-4 text-primary" /> Dose pediátrica (mg/kg/dia)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Peso (kg)</Label>
            <Input type="number" inputMode="decimal" value={f.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Dose (mg/kg/dia)</Label>
            <Input type="number" inputMode="decimal" value={f.mgPerKgPerDay} onChange={(e) => set("mgPerKgPerDay", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Tomadas por dia</Label>
            <Input type="number" inputMode="numeric" value={f.dosesPerDay} onChange={(e) => set("dosesPerDay", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Dose máx./dia (mg) — opcional</Label>
            <Input type="number" inputMode="decimal" value={f.maxMgPerDay} onChange={(e) => set("maxMgPerDay", e.target.value)} />
          </div>
          <div className="grid gap-1.5 sm:col-span-2">
            <Label>Concentração (mg/mL) — opcional, para volume</Label>
            <Input type="number" inputMode="decimal" value={f.concentrationMgPerMl} onChange={(e) => set("concentrationMgPerMl", e.target.value)} />
          </div>
        </div>

        {parsed.success ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <Result label="Total por dia" value={`${totalMgDay.toFixed(1)} mg`} note={capped ? "Limitado pela dose máxima" : undefined} />
            <Result label="Por tomada" value={`${perDoseMg.toFixed(1)} mg`} />
            {perDoseMl != null && <Result label="Volume por tomada" value={`${perDoseMl.toFixed(2)} mL`} />}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Preencha peso, dose e número de tomadas.</p>
        )}
        <p className="text-xs text-muted-foreground">
          Estimativa referencial. Sempre confira a dose máxima do fármaco e arredonde conforme a
          apresentação disponível. <strong>Não substitui a conferência da prescrição.</strong>
        </p>
      </CardContent>
    </Card>
  );
}

function Result({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="rounded-md border bg-muted/40 p-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-xl font-bold">{value}</div>
      {note && <div className="text-xs text-severity-medium">{note}</div>}
    </div>
  );
}
