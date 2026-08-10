"use client";
import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Pill, GitCompareArrows, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { searchDrugs, countDrugs } from "@/actions/drugs";

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

type Sel = { id: string; activeIngredient: string };

export function DrugSearch() {
  const [term, setTerm] = React.useState("");
  const [reviewedOnly, setReviewedOnly] = React.useState(false);
  const [selected, setSelected] = React.useState<Sel[]>([]);
  const debounced = useDebounced(term, 250);
  const { data: total } = useQuery({
    queryKey: ["drug-count", reviewedOnly],
    queryFn: () => countDrugs(reviewedOnly),
    staleTime: 5 * 60_000,
  });
  const enabled = debounced.trim().length > 0 || reviewedOnly;
  const { data, isFetching } = useQuery({
    queryKey: ["drugs", debounced, reviewedOnly],
    queryFn: () => searchDrugs(debounced, reviewedOnly),
    enabled,
  });

  const selectedIds = React.useMemo(() => new Set(selected.map((s) => s.id)), [selected]);
  const toggle = (d: Sel) =>
    setSelected((p) => (p.some((s) => s.id === d.id) ? p.filter((s) => s.id !== d.id) : [...p, d]));
  const idsParam = selected.map((s) => s.id).join(",");

  return (
    <div className="space-y-4 pb-24">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        {isFetching && <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />}
        <Input
          autoFocus
          placeholder="Buscar por princípio ativo, nome comercial ou classe terapêutica…"
          className="pl-10"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          {typeof total === "number" ? <><strong>{total.toLocaleString("pt-BR")}</strong> medicamentos no catálogo. </> : null}
          Digite para buscar; marque os <strong>checkboxes</strong> para checar interações entre 2 ou mais.
        </p>
        <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium">
          <input
            type="checkbox"
            checked={reviewedOnly}
            onChange={(e) => setReviewedOnly(e.target.checked)}
            className="h-4 w-4 accent-primary"
          />
          Somente validados
        </label>
      </div>

      {!enabled && (
        <p className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
          <Search className="mx-auto mb-2 h-6 w-6 opacity-60" />
          Comece a digitar para buscar entre os {typeof total === "number" ? total.toLocaleString("pt-BR") : "milhares de"} medicamentos
          (por princípio ativo, nome comercial ou classe). Ex.: <em>paracetamol</em>, <em>losartana</em>, <em>omeprazol</em>.
        </p>
      )}

      {enabled && data && data.length === 0 && !isFetching && (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhum medicamento encontrado{debounced ? ` para “${debounced}”` : ""}.
        </p>
      )}

      {enabled && data && data.length === 100 && (
        <p className="text-center text-xs text-muted-foreground">
          Mostrando os primeiros 100 resultados — refine a busca para encontrar mais.
        </p>
      )}

      <div className="grid gap-2">
        {data?.map((d) => {
          const checked = selectedIds.has(d.id);
          return (
            <Card key={d.id} className={`transition-colors ${checked ? "border-primary/60 bg-primary/5" : ""}`}>
              <CardContent className="flex items-center gap-3 p-4">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle({ id: d.id, activeIngredient: d.activeIngredient })}
                  className="h-5 w-5 shrink-0 accent-primary"
                  aria-label={`Selecionar ${d.activeIngredient}`}
                />
                <Link href={`/medicamentos/${d.id}`} className="group flex flex-1 items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Pill className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="font-medium group-hover:text-primary">{d.activeIngredient}</div>
                      <div className="text-xs text-muted-foreground">{d.name} · {d.therapeuticClass}</div>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {d.pregnancyCategory && (
                      <Badge variant="outline" title="Categoria de risco na gestação">
                        Gestação {d.pregnancyCategory}
                      </Badge>
                    )}
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        d.reviewed
                          ? "bg-severity-low/15 text-severity-low"
                          : "bg-severity-medium/15 text-severity-medium"
                      }`}
                      title={d.reviewed ? "Conteúdo validado" : "Nome/classe oficiais; conteúdo clínico pendente"}
                    >
                      {d.reviewed ? "Validado" : "Não validado"}
                    </span>
                  </div>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Barra de ação fixa quando há selecionados */}
      {selected.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur">
          <div className="container flex items-center justify-between gap-3 py-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">{selected.length}</span> selecionado(s)
              <button onClick={() => setSelected([])} className="ml-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
                <X className="h-3 w-3" /> limpar
              </button>
            </div>
            {selected.length >= 2 ? (
              <Link
                href={`/interacoes?ids=${idsParam}`}
                className="inline-flex items-center gap-2 rounded-lg brand-gradient px-4 py-2 text-sm font-bold text-white shadow-sm"
              >
                <GitCompareArrows className="h-4 w-4" /> Checar interações ({selected.length})
              </Link>
            ) : (
              <span className="text-xs text-muted-foreground">Marque +1 para checar interações</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
