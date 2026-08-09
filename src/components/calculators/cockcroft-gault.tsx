"use client";
import * as React from "react";
import { Droplets } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cockcroftSchema } from "@/lib/validations";
import { cockcroftGault, classifyClcr } from "@/lib/clinical";

export function CockcroftGault() {
  const [f, setF] = React.useState({ age: "", weightKg: "", serumCreatinine: "", sex: "M" });
  const parsed = cockcroftSchema.safeParse(f);
  const result = parsed.success ? cockcroftGault(parsed.data) : null;
  const cls = result != null ? classifyClcr(result) : null;
  const toneClass = cls
    ? cls.tone === "high" ? "text-severity-high" : cls.tone === "medium" ? "text-severity-medium" : cls.tone === "low" ? "text-severity-low" : "text-foreground"
    : "";

  const set = (k: string, v: string) => setF((p) => ({ ...p, [k]: v }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Droplets className="h-4 w-4 text-primary" /> Clearance de creatinina (Cockcroft-Gault)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Idade (anos)</Label>
            <Input type="number" inputMode="numeric" value={f.age} onChange={(e) => set("age", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Peso (kg)</Label>
            <Input type="number" inputMode="decimal" value={f.weightKg} onChange={(e) => set("weightKg", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Creatinina sérica (mg/dL)</Label>
            <Input type="number" inputMode="decimal" step="0.1" value={f.serumCreatinine} onChange={(e) => set("serumCreatinine", e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Sexo</Label>
            <Select value={f.sex} onValueChange={(v) => set("sex", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {result != null ? (
          <div className="rounded-md border bg-muted/40 p-4">
            <div className="text-sm text-muted-foreground">Clearance estimado (ClCr)</div>
            <div className={`text-3xl font-bold ${toneClass}`}>{result.toFixed(1)} <span className="text-lg">mL/min</span></div>
            {cls && <div className={`text-sm font-medium ${toneClass}`}>{cls.label}</div>}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Preencha os campos para calcular.</p>
        )}
        <p className="text-xs text-muted-foreground">
          Fórmula: ((140 − idade) × peso) / (72 × Cr) × 0,85 se feminino. Considere peso ideal/ajustado
          conforme o caso. Estimativa referencial — <strong>confira antes do ajuste de dose</strong>.
        </p>
      </CardContent>
    </Card>
  );
}
