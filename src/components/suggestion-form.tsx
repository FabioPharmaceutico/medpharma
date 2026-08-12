"use client";
import * as React from "react";
import { toast } from "sonner";
import { Send, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createSuggestion } from "@/actions/feedback";

const CATEGORIAS: Record<string, string> = {
  SUGESTAO: "Sugestão",
  DICA: "Dica",
  CRITICA: "Crítica / correção",
};

export function SuggestionForm() {
  const [form, setForm] = React.useState({ name: "", email: "", category: "SUGESTAO", message: "" });
  const [sent, setSent] = React.useState(false);
  const [pending, start] = React.useTransition();
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (form.message.trim().length < 5) {
      toast.error("Escreva sua mensagem (mín. 5 caracteres).");
      return;
    }
    start(async () => {
      const res = await createSuggestion({
        name: form.name || null,
        email: form.email || null,
        category: form.category as any,
        message: form.message,
      });
      if (res.ok) {
        setSent(true);
        toast.success(res.message ?? "Enviado!");
      } else {
        toast.error(res.message ?? "Erro ao enviar.");
      }
    });
  };

  if (sent) {
    return (
      <Card className="border-severity-low/30 bg-severity-low/5">
        <CardContent className="flex flex-col items-center gap-3 p-8 text-center">
          <CheckCircle2 className="h-10 w-10 text-severity-low" />
          <h3 className="text-lg font-bold">Mensagem enviada!</h3>
          <p className="text-sm text-muted-foreground">
            Obrigado por contribuir com o MedPharma. Sua dica/sugestão foi registrada e será lida pelo desenvolvedor.
          </p>
          <Button variant="outline" onClick={() => { setSent(false); setForm({ name: "", email: "", category: "SUGESTAO", message: "" }); }}>
            Enviar outra
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1.5">
            <Label>Seu nome (opcional)</Label>
            <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Como quer ser chamado(a)" />
          </div>
          <div className="grid gap-1.5">
            <Label>Seu e-mail (opcional, para retorno)</Label>
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="voce@exemplo.com" />
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label>Tipo</Label>
          <Select value={form.category} onValueChange={(v) => set("category", v)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(CATEGORIAS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label>Mensagem</Label>
          <Textarea value={form.message} onChange={(e) => set("message", e.target.value)} rows={5}
            placeholder="Sua dica, crítica ou sugestão. Ex.: 'seria útil um filtro por via de administração', 'a dose de X parece incorreta', etc." />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <a href="mailto:fabio.pharmaceutico@gmail.com?subject=MedPharma%20-%20Sugest%C3%A3o"
             className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <Mail className="h-4 w-4" /> Prefere e-mail? fabio.pharmaceutico@gmail.com
          </a>
          <Button onClick={submit} disabled={pending}>
            <Send className="h-4 w-4" /> {pending ? "Enviando…" : "Enviar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
