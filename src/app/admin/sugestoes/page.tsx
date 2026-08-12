import { listSuggestions } from "@/actions/feedback";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";

export const metadata = { title: "Admin — Sugestões" };
export const dynamic = "force-dynamic";

const LABELS: Record<string, string> = { DICA: "Dica", CRITICA: "Crítica", SUGESTAO: "Sugestão" };

export default async function AdminSugestoesPage({
  searchParams,
}: {
  searchParams?: { key?: string };
}) {
  const key = searchParams?.key ?? "";
  let data: Awaited<ReturnType<typeof listSuggestions>> = null;
  try {
    data = await listSuggestions(key);
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <Lock className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
        <h1 className="text-xl font-bold">Área restrita</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Acesse com a chave de administrador: <code className="rounded bg-muted px-1">/admin/sugestoes?key=SUA_CHAVE</code>
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Sugestões recebidas</h1>
        <p className="text-sm text-muted-foreground">{data.length} mensagem(ns).</p>
      </div>
      {data.length === 0 && (
        <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhuma mensagem ainda.
        </p>
      )}
      <div className="space-y-3">
        {data.map((s) => (
          <Card key={s.id}>
            <CardContent className="space-y-2 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{LABELS[s.category] ?? s.category}</Badge>
                  <span className="font-medium">{s.name || "Anônimo"}</span>
                  {s.email && <a href={`mailto:${s.email}`} className="text-primary hover:underline">{s.email}</a>}
                </div>
                <span className="text-muted-foreground">{new Date(s.createdAt).toLocaleString("pt-BR")}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm">{s.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
