import Link from "next/link";
import {
  Search, GitCompareArrows, ClipboardList, Calculator, ArrowRight, Sparkles, BookOpen, Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ClinicalDisclaimer } from "@/components/clinical-disclaimer";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const modules = [
  { href: "/medicamentos", title: "Consulta de Medicamentos", desc: "Busca por princípio ativo, nome comercial ou classe. Ficha completa com posologia, populações especiais, RAM e gestação.", icon: Search, grad: "grad-cyan" },
  { href: "/interacoes", title: "Checagem de Interações", desc: "Adicione múltiplos fármacos e veja a matriz de interações por severidade, com mecanismo e conduta.", icon: GitCompareArrows, grad: "grad-violet", ai: true },
  { href: "/intervencoes", title: "Intervenções Farmacêuticas", desc: "Registre PRM (Dáder/Granada), aceitabilidade médica e status. Exporte relatório em PDF.", icon: ClipboardList, grad: "grad-emerald" },
  { href: "/calculadoras", title: "Calculadoras Clínicas", desc: "Cockcroft-Gault, dose pediátrica (mg/kg/dia) e conversão de corticoides.", icon: Calculator, grad: "grad-amber" },
  { href: "/importacao", title: "Importação do Bulário", desc: "Extração por OCR do bulário com fila de revisão farmacêutica antes do uso.", icon: BookOpen, grad: "grad-pink", ai: true },
];

async function getStats() {
  try {
    const [drugs, interactions, interventions] = await Promise.all([
      prisma.drug.count(),
      prisma.drugInteraction.count(),
      prisma.pharmaceuticalIntervention.count(),
    ]);
    return { drugs, interactions, interventions };
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const stats = await getStats();
  return (
    <div className="space-y-10">
      <section className="hero-surface -mx-6 rounded-b-[2rem] border-b px-6 pb-10 pt-6">
        <div className="aurora-bar absolute inset-x-0 top-0 h-1" />
        <div className="space-y-5">
          <span className="ai-chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 dot" /> MedPharma · Inteligência Farmacêutica
          </span>
          <h1 className="max-w-4xl text-5xl font-black leading-[1.05] sm:text-6xl">
            Decisões farmacêuticas <span className="brand-text">mais seguras</span>,<br className="hidden sm:block" />
            potencializadas por dados.
          </h1>
          <p className="max-w-2xl text-xl text-muted-foreground">
            Consulta de medicamentos, checagem multidrogas de interações, intervenções farmacêuticas
            e calculadoras clínicas — numa plataforma única, responsiva e instalável.
          </p>
          <ClinicalDisclaimer />
        </div>
      </section>

      {stats ? (
        <section className="grid grid-cols-3 gap-4">
          <StatCard label="Medicamentos" value={stats.drugs} grad="grad-cyan" icon={Search} />
          <StatCard label="Interações" value={stats.interactions} grad="grad-violet" icon={GitCompareArrows} />
          <StatCard label="Intervenções" value={stats.interventions} grad="grad-emerald" icon={ClipboardList} />
        </section>
      ) : (
        <div className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">
          Banco não conectado ou vazio. Rode <code className="rounded bg-muted px-1">npm run db:push</code> e{" "}
          <code className="rounded bg-muted px-1">npm run db:seed</code>.
        </div>
      )}

      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-extrabold">Módulos</h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {modules.map(({ href, title, desc, icon: Icon, grad, ai }) => (
            <Link key={href} href={href} className="group">
              <Card className="tile h-full overflow-hidden border-border/70 glass">
                <div className={`${grad} h-1.5 w-full opacity-90`} />
                <CardContent className="space-y-3 p-6">
                  <div className="flex items-center justify-between">
                    <span className={`${grad} flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-md`}>
                      <Icon className="h-6 w-6" />
                    </span>
                    {ai && (
                      <span className="ai-chip inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider">
                        <Sparkles className="h-3 w-3" /> IA
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
                  <span className="inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-primary">
                    Abrir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label, value, grad, icon: Icon,
}: { label: string; value: number; grad: string; icon: any }) {
  return (
    <Card className="tile overflow-hidden glass">
      <CardContent className="flex items-center gap-3 p-5">
        <span className={`${grad} flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="text-3xl font-black leading-none">{value}</div>
          <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
