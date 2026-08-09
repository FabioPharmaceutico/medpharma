"use client";
import * as React from "react";
import { ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CORTICOIDS, convertCorticoid } from "@/lib/clinical";

export function CorticoidConversion() {
  const keys = Object.keys(CORTICOIDS);
  const [from, setFrom] = React.useState("prednisona");
  const [to, setTo] = React.useState("dexametasona");
  const [dose, setDose] = React.useState("20");

  const doseNum = parseFloat(dose);
  const result = !isNaN(doseNum) && doseNum > 0 ? convertCorticoid(from, to, doseNum) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <ArrowRightLeft className="h-4 w-4 text-primary" /> Conversão de corticosteroides
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <Label>De</Label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {keys.map((k) => <SelectItem key={k} value={k}>{CORTICOIDS[k].label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-1.5">
            <Label>Dose (mg)</Label>
            <Input type="number" inputMode="decimal" value={dose} onChange={(e) => setDose(e.target.value)} />
          </div>
          <div className="grid gap-1.5">
            <Label>Para</Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {keys.map((k) => <SelectItem key={k} value={k}>{CORTICOIDS[k].label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {result != null && !isNaN(result) ? (
          <div className="rounded-md border bg-muted/40 p-4">
            <div className="text-sm text-muted-foreground">
              {doseNum} mg de {CORTICOIDS[from].label} ≈
            </div>
            <div className="text-3xl font-bold text-primary">{result.toFixed(2)} <span className="text-lg">mg</span></div>
            <div className="text-sm font-medium">de {CORTICOIDS[to].label}</div>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Informe uma dose válida.</p>
        )}
        <p className="text-xs text-muted-foreground">
          Equivalência anti-inflamatória (glicocorticoide) apenas. Não reflete potência mineralocorticoide,
          duração de ação nem via de administração. <strong>Ajuste conforme o quadro clínico.</strong>
        </p>
      </CardContent>
    </Card>
  );
}
