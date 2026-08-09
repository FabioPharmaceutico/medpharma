"use client";
import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Pill } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { searchDrugs } from "@/actions/drugs";

function useDebounced<T>(value: T, delay = 250) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export function DrugSearch() {
  const [term, setTerm] = React.useState("");
  const debounced = useDebounced(term, 250);
  const { data, isFetching } = useQuery({
    queryKey: ["drugs", debounced],
    queryFn: () => searchDrugs(debounced),
  });

  return (
    <div className="space-y-4">
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

      {data && data.length === 0 && (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhum medicamento encontrado{debounced ? ` para “${debounced}”` : ""}.
        </p>
      )}

      <div className="grid gap-2">
        {data?.map((d) => (
          <Link key={d.id} href={`/medicamentos/${d.id}`} className="group">
            <Card className="transition-colors group-hover:border-primary/60">
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Pill className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="font-medium">{d.activeIngredient}</div>
                    <div className="text-xs text-muted-foreground">
                      {d.name} · {d.therapeuticClass}
                    </div>
                  </div>
                </div>
                {d.pregnancyCategory && (
                  <Badge variant="outline" title="Categoria de risco na gestação">
                    Gestação {d.pregnancyCategory}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
