import Link from "next/link";
import { Pill, ShieldAlert, MessageSquareHeart, Mail } from "lucide-react";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 border-t bg-muted/30">
      <div className="container space-y-3 py-8 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-6 w-6 items-center justify-center rounded-md brand-gradient text-white">
              <Pill className="h-4 w-4" />
            </span>
            MedPharma
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/sugestoes" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
              <MessageSquareHeart className="h-4 w-4" /> Dicas, críticas e sugestões
            </Link>
            <a href="mailto:fabio.pharmaceutico@gmail.com?subject=MedPharma" className="inline-flex items-center gap-1.5 hover:text-foreground">
              <Mail className="h-4 w-4" /> fabio.pharmaceutico@gmail.com
            </a>
          </div>
        </div>

        <div className="flex items-start gap-2 rounded-md border border-severity-medium/30 bg-severity-medium/10 p-3 text-xs text-severity-medium">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <p>
            Ferramenta de <strong>apoio à decisão</strong> — não substitui o julgamento clínico,
            a bula oficial (Anvisa) nem referências primárias. Conteúdo redigido de fontes abertas/oficiais
            (não reproduz bases proprietárias) e deve ser <strong>validado por profissional responsável</strong>.
            Uso por conta e risco do usuário.
          </p>
        </div>

        <p className="text-xs">
          © {year} <strong>Fábio Rogério de Oliveira da Cunha</strong> — Farmacêutico-Bioquímico (CRF-GO/CRF-SP).
          Todos os direitos reservados. É vedada a reprodução ou uso comercial sem autorização.
          Veja os termos completos no arquivo <code className="rounded bg-muted px-1">LICENSE.md</code>.
        </p>
      </div>
    </footer>
  );
}
