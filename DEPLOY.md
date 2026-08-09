# Publicar o MedPharma online (Vercel + Postgres)

O app online **não usa SQLite** (servidores serverless não gravam arquivo local).
Ele usa PostgreSQL na nuvem. O código já é compatível com os dois: local = SQLite,
produção = Postgres (via `prisma/schema.postgres.prisma`, usado no build da Vercel).

## Visão geral (o que cada parte faz)
1. **Banco na nuvem (grátis)** — cria um PostgreSQL. Você recebe uma `DATABASE_URL`.
2. **Vercel** — hospeda o app e o deixa numa URL pública (https), que permite instalar como PWA no celular/tablet.
3. **Popular o banco** — rodar `db:push:prod` + `db:seed:prod` uma vez, apontando para a `DATABASE_URL` da nuvem.

## Passo a passo

### 1) Criar o Postgres (Neon — grátis)
- Acesse neon.tech e entre com Google/GitHub.
- Crie um projeto. Copie a **connection string** (algo como
  `postgresql://user:senha@ep-xxx.neon.tech/neondb?sslmode=require`).

### 2) Preparar o banco (uma vez, do seu PC)
No PowerShell, dentro da pasta do projeto:
```powershell
$env:DATABASE_URL="COLE_A_URL_DO_NEON_AQUI"
npm run db:push:prod
npm run db:seed:prod
```
Isso cria as tabelas e insere os 22 medicamentos + interações no banco da nuvem.

### 3) Publicar na Vercel
Opção mais simples (CLI):
```powershell
npm i -g vercel
vercel login          # abre o navegador para você autorizar
vercel                # primeiro deploy (responda os prompts com Enter)
```
No painel da Vercel (vercel.com) → seu projeto → **Settings → Environment Variables**:
- Adicione `DATABASE_URL` = a mesma URL do Neon.
Depois:
```powershell
vercel --prod         # publica a versão final
```
A Vercel te dá uma URL tipo `https://medpharma.vercel.app`.

### 4) Instalar no celular/tablet
Abra a URL no navegador do celular → menu → **Adicionar à tela inicial / Instalar app**.

## Observação de dados clínicos
Os dados do seed são ilustrativos e exigem validação farmacêutica antes de uso
assistencial (ver README). Ao publicar online, você assume a responsabilidade pelo
conteúdo exibido.
