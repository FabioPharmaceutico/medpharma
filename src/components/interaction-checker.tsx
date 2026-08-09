"use client";
import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { X, Search, GitCompareArrows, Utensils, ShieldCheck, Loader2, ListChecks } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge, SeverityDot } from "@/components/ui/severity-badge";
import { listAllDrugsMinimal, type DrugListItem } from "@/actions/drugs";
import { checkInteractions } from "@/actions/interactions";

type PickItem = { id: string; name: string; activeIngredient: string; therapeuticClass?: string };

export function InteractionChecker({ initial = [] as DrugListItem[] }) {
  const [selected, setSelected] = React.useState<PickItem[]>(initial);
  const [term, setTerm] = React.useState("");

  // Carrega TODOS os medicamentos uma vez, para navegação por checkbox.
  const { data: allDrugs, isFetching: loadingAll } = useQuery({
    queryKey: ["all-drugs"],
    queryFn: () => listAllDrugsMinimal(),
    staleTime: 5 * 60_000,
  });

  const selectedIds = React.useMemo(() => new Set(selected.map((s) => s.id)), [selected]);

  const filtered = React.useMemo(() => {
    const list = allDrugs ?? [];
    const q = term.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (d) =>
        d.activeIngredient.toLowerCase().includes(q) ||
        d.name.toLowerCase().includes(q) ||
        d.therapeuticClass.toLowerCase().includes(q)
    );
  }, [allDrugs, term]);

  const ids = selected.map((d) => d.id);
  const { data: check, isFetching: checking } = useQuery({
    queryKey: ["check", ids.slice().sort().join(",")],
    queryFn: () => checkInteractions(ids),
    enabled: ids.length >= 2,
  });

  const toggle = (d: PickItem) => {
    setSelected((p) => (p.some((s) => s.id === d.id) ? p.filter((s) => s.id !== d.id) : [...p, d]));
  };
  const remove = (id: string) => setSelected((p) => p.filter((s) => s.id !== id));

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr]">
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ListChecks className="h-4 w-4 text-primary" /> Selecione os medicamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              {loadingAll && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
              <Input
                placeholder="Filtrar por princípio ativo, nome ou classe…"
                className="pl-10"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
            </div>

            {/* Contador + limpar */}
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{selected.length} selecionado(s) · {(allDrugs ?? []).length} no catálogo</span>
              {selected.length > 0 && (
                <button className="font-medium text-primary hover:underline" onClick={() => setSelected([])}>
                  Limpar
                </button>
              )}
            </div>

            {/* Lista completa com checkbox */}
            <div className="max-h-[420px] overflow-auto rounded-md border">
              {filtered.length === 0 && (
                <p className="p-4 text-center text-xs text-muted-foreground">
                  {loadingAll ? "Carregando catálogo…" : "Nenhum medicamento encontrado."}
                </p>
              )}
              {filtered.map((d) => {
                const checked = selectedIds.has(d.id);
                return (
                  <label
                    key={d.id}
                    className={`flex cursor-pointer items-center gap-3 border-b px-3 py-2 text-sm last:border-0 hover:bg-accent ${
                      checked ? "bg-primary/5" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle({ id: d.id, name: d.name, activeIngredient: d.activeIngredient, therapeuticClass: d.therapeuticClass })}
                      className="h-4 w-4 shrink-0 accent-primary"
                    />
                    <span className="min-w-0">
                      <span className="font-medium">{d.activeIngredient}</span>
                      <span className="block truncate text-xs text-muted-foreground">{d.therapeuticClass}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Chips dos selecionados */}
            {selected.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selected.map((d) => (
                  <span key={d.id} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs">
                    {d.activeIngredient}
                    <button onClick={() => remove(d.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remover">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {selected.length < 2 && (
              <p className="rounded-md border border-dashed p-3 text-center text-xs text-muted-foreground">
                Marque <strong>2 ou mais</strong> para ver as interações.
              </p>
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
            <GitCompareArrows className="mr-2 h-5 w-5" /> Marque 2+ medicamentos na lista ao lado…
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
