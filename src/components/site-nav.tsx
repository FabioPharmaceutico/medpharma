"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill, Search, GitCompareArrows, ClipboardList, Calculator, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  { href: "/medicamentos", label: "Medicamentos", icon: Search },
  { href: "/interacoes", label: "Interações", icon: GitCompareArrows },
  { href: "/intervencoes", label: "Intervenções", icon: ClipboardList },
  { href: "/calculadoras", label: "Calculadoras", icon: Calculator },
  { href: "/importacao", label: "Importação", icon: BookOpen },
];

export function SiteNav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-2">
        <Link href="/" className="mr-5 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient text-white shadow-sm">
            <Pill className="h-5 w-5" />
          </span>
          <span className="hidden text-xl font-extrabold tracking-tight brand-text sm:inline">
            MedPharma
          </span>
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {links.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[0.95rem] font-medium transition-colors",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{label}</span>
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  );
}
