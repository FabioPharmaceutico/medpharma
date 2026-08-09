# med-app — Consulta de Medicamentos, Interações e Intervenções Farmacêuticas

Aplicação web / PWA para apoio à prática clínica farmacêutica. Construída com
Next.js (App Router, Server Actions), TypeScript, Tailwind + shadcn UI, Prisma +
PostgreSQL, TanStack Query e Zod.

## ⚠️ Aviso clínico (leia antes de usar)

Este software é uma **ferramenta de APOIO à decisão**. Ele **NÃO substitui** o
julgamento do farmacêutico, do médico prescritor, nem a consulta às bulas
oficiais (Anvisa/bulário) e às referências primárias.

- A base de interações e as fichas de medicamentos incluídas no `seed` são um
  **conjunto inicial ilustrativo** e **DEVEM ser validadas por farmacêutico
  responsável** e mantidas contra fontes oficiais (bulário Anvisa, Micromedex,
  UpToDate, Lexicomp) **antes de qualquer uso assistencial**.
- Cálculos de dose são referenciais. **Toda dose deve ser conferida** antes da
  dispensação/administração.
- Não use este protótipo em ambiente de produção assistencial sem revisão
  clínica, validação de dados e homologação institucional.

## LGPD

O registro de intervenções usa **identificador anônimo do paciente**
(`patientRef`) — não armazene nome, CPF ou dados diretamente identificáveis.
Ajuste a política de retenção e a base legal conforme sua instituição.

## Como rodar (local — SQLite, sem Docker)

Pré-requisito: **apenas Node.js 18+** (baixe em https://nodejs.org — versão LTS).
O banco local é SQLite (um arquivo `prisma/dev.db`), então não precisa de Docker
nem instalar PostgreSQL.

No PowerShell, dentro da pasta do projeto:

```powershell
# 1. Instalar dependências
npm install

# 2. Criar o arquivo de ambiente (SQLite já é o padrão)
copy .env.example .env

# 3. Criar o banco e popular com o seed clínico
npm run db:push
npm run db:seed

# 4. Rodar em desenvolvimento
npm run dev
# abrir http://localhost:3000
```

> Testado de ponta a ponta: db push + seed (22 medicamentos, 22 interações) +
> todas as páginas respondendo HTTP 200.

## Produção com PostgreSQL (opcional)

O schema de produção com enums nativos está em `prisma/schema.postgres.prisma`.
Para migrar: aponte `DATABASE_URL` no `.env` para um PostgreSQL (Docker, Supabase,
Neon, RDS), copie o schema Postgres sobre `prisma/schema.prisma` e rode
`npm run db:push && npm run db:seed`. O `docker-compose.yml` incluso sobe um
Postgres local (`docker compose up -d`).

## Módulos

- **A — Consulta:** busca em tempo real por princípio ativo (DCB), nome comercial
  ou classe terapêutica; ficha com posologia, ajustes (renal/hepático/geriátrico/
  pediátrico), contraindicações, RAM por frequência, categoria de gestação/lactação.
- **B — Interações:** lista multidrogas + matriz de severidade (🔴 grave / 🟡
  moderada / 🔵 leve) com mecanismo, efeito clínico e conduta; interações
  medicamento × alimento.
- **C — Intervenções:** registro PRM (classificação Dáder/Granada), aceitabilidade
  médica, status, exportação de relatório em PDF.
- **D — Calculadoras:** Cockcroft-Gault (clearance de creatinina), dose pediátrica
  (mg/kg/dia), conversão de corticoides.
- **Importação do Bulário (`/importacao`):** pipeline OCR que extrai monografias do
  Bulário Explicativo (PDF escaneado) e as coloca numa fila de revisão. Nada entra
  na Consulta sem aprovação farmacêutica. Ver `tools/bulario/README.md`.

## ⚠️ Direitos autorais do bulário

O "Bulário Explicativo" é obra protegida por direito autoral. O importador destina-se
a **uso pessoal/interno de referência** do proprietário do exemplar. **Não** incorpore
o conteúdo integral em produto distribuído/comercializado sem autorização da editora.
Para produtos comerciais, use fontes licenciadas ou oficiais (bulário eletrônico da
Anvisa, RENAME, DCB).

## Estrutura

```
prisma/            schema + seed clínico
src/app/           rotas (App Router): /, /medicamentos, /interacoes, /intervencoes, /calculadoras
src/actions/       Server Actions (Prisma)
src/components/    UI (shadcn-style), tema, navegação, features
src/lib/           prisma client, utils, validações Zod, dados clínicos das calculadoras
```

## Scripts

| Comando | Ação |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run db:push` | Aplica o schema no banco |
| `npm run db:seed` | Popula medicamentos e interações |
| `npm run db:studio` | Prisma Studio (inspeção do banco) |
| `npm run typecheck` | Checagem de tipos |
