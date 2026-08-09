import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">Página não encontrada</h2>
      <p className="text-muted-foreground">O recurso solicitado não existe.</p>
      <Link href="/"><Button>Voltar ao início</Button></Link>
    </div>
  );
}
