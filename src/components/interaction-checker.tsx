"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, X, Search, GitCompareArrows, Utensils, ShieldCheck, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge, SeverityDot } from "@/components/ui/severity-badge";
import { searchDrugs, type DrugListItem } from "@/actions/drugs";
import { checkInteractions } from "@/actions/interactions";

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function InteractionChecker({ initial = [] as DrugListItem[] }) {
  const [selected, setSelected] = React.useState<DrugListItem[]>(initial);
  const [term, setTerm] = React.useState("");
  const debounced = useDebounced(term, 250);

  const { data: results, isFetching: searching } = useQuery({
    queryKey: ["drug-picker", debounced],
    queryFn: () => searchDrugs(debounced),
    enabled: debounced.length > 0,
  });

  const ids = selected.map((d) => d.id);
  const { data: check, isFetching: checking } = useQuery({
    queryKey: ["check", ids.sort().join(",")],
    queryFn: () => checkInteractions(ids),
    enabled: ids.length >= 2,
  });

  const add = (d: DrugListItem) => {
    if (!selected.find((s) => s.id === d.id)) setSelected((p) => [...p, d]);
    setTerm("");
  };
  const remove = (id: string) => setSelected((p) => p.filter((s) => s.id !== id));

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Lista de medicamentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              {searching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
              <Input placeholder="Adicionar fármaco…" className="pl-10" value={term} onChange={(e) => setTerm(e.target.value)} />
            </div>

            {debounced && results && results.length > 0 && (
              <div className="max-h-64 overflow-auto rounded-md border">
                {results.map((d) => {
                  const already = selected.some((s) => s.id === d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() => add(d)}
                      disabled={already}
                      className="flex w-full items-center justify-between gap-2 border-b px-3 py-2 text-left text-sm last:border-0 hover:bg-accent disabled:opacity-40"
                    >
                      <span>
                        <span className="font-medium">{d.activeIngredient}</span>
                        <span className="text-muted-foreground"> · {d.name}</span>
                      </span>
                      <Plus className="h-4 w-4 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="space-y-2">
              {selected.length === 0 && (
                <p className="rounded-md border border-dashed p-4 text-center text-xs text-muted-foreground">
                  Adicione ao menos 2 medicamentos para checar as interações.
                </p>
              )}
              {selected.map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <span>
                    <span className="font-medium">{d.activeIngredient}</span>
                    <span className="text-muted-foreground"> · {d.name}</span>
                  </span>
                  <button onClick={() => remove(d.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remover">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {selected.length > 0 && (
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setSelected([])}>
                Limpar lista
              </Button>
            )}
          </CardContent>
        </Card>

        {check && ids.length >= 2 && (
          <Card>
            <CardContent className="flex items-center justify-around gap-2 p-4 text-center text-xs">
              <Legend n={check.counts.HIGH} sev="HIGH" label="Graves" />
              <Legend n={check.counts.MEDIUM} sev="MEDIUM" label="Moderadas" />
              <Legend n={check.counts.LOW} sev="LOW" label="Leves" />
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-4">
        {ids.length < 2 && (
          <div className="flex h-40 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            <GitCompareArrows className="mr-2 h-5 w-5" /> Aguardando 2+ medicamentos…
          </div>
        )}

        {checking && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Analisando interações…
          </div>
        )}

        {check && ids.length >= 2 && check.interactions.length === 0 && (
          <div className="flex items-center gap-2 rounded-md border border-severity-low/30 bg-severity-low/10 p-4 text-sm text-severity-low">
            <ShieldCheck className="h-5 w-5" />
            Nenhuma interação cadastrada entre os fármacos selecionados. Isso <strong>não descarta</strong> interações
            ausentes da base — confirme em fonte oficial.
          </div>
        )}

        {check?.interactions.map((i) => (
          <Card key={i.id} className="overflow-hidden">
            <div className={
              i.severity === "HIGH" ? "h-1 bg-severity-high" :
              i.severity === "MEDIUM" ? "h-1 bg-severity-medium" : "h-1 bg-severity-low"
            } />
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">
                  {i.drugA.activeIngredient} <span className="text-muted-foreground">×</span> {i.drugB.activeIngredient}
                </CardTitle>
                <SeverityBadge severity={i.severity} />
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Mecanismo" value={i.mechanism} />
              <Row label="Efeito clínico" value={i.clinicalEffect} />
              <Row label="Conduta farmacêutica" value={i.recommendation} highlight />
              {i.reference && <p className="text-xs text-muted-foreground">Referência: {i.reference}</p>}
            </CardContent>
          </Card>
        ))}

        {check && check.foods.length > 0 && ids.length >= 1 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Utensils className="h-4 w-4 text-primary" /> Interações medicamento × alimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {check.foods.map((f) => (
                <div key={f.drugId} className="rounded-md border p-3">
                  <div className="font-medium">{f.activeIngredient}</div>
                  <div className="text-muted-foreground">{f.foodInteractions}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

function Legend({ n, sev, label }: { n: number; sev: "HIGH" | "MEDIUM" | "LOW"; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1.5">
        <SeverityDot severity={sev} />
        <span className="text-lg font-bold">{n}</span>
      </div>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={highlight ? "rounded-md bg-primary/5 p-2" : ""}>
      <span className="font-semibold">{label}: </span>
      <span className={highlight ? "" : "text-muted-foreground"}>{value}</span>
    </div>
  );
}
