# Importador do Bulário (OCR → revisão → banco)

Pipeline para extrair monografias do **Bulário Explicativo** (PDF escaneado, sem
camada de texto no miolo) e trazê-las para o `med-app` — sempre passando por
**revisão farmacêutica** antes de qualquer uso clínico.

## ⚠️ AVISO DE DIREITOS AUTORAIS (leia primeiro)

O **"Bulário Explicativo"** é uma **obra publicada e protegida por direito autoral**
(editora, autoras e revisora identificadas na obra). Este pipeline destina-se à
**extração para uso pessoal/interno de referência** por quem possui o exemplar
legítimo.

**Não** incorpore o conteúdo integral em um produto **distribuído ou comercializado**
(SaaS público, infoproduto, app à venda) **sem autorização/licença expressa da
editora**. O uso é de responsabilidade do operador. Para um produto comercial,
prefira fontes com licença adequada ou dados de domínio público/oficiais
(ex.: bulário eletrônico da Anvisa, RENAME, DCB).

## Por que precisa de OCR

O PDF tem 1060 páginas; o corpo (monografias) são **imagens escaneadas a 200 dpi
sem texto pesquisável**. Só o sumário inicial tem camada de texto. Por isso o
pipeline **renderiza cada página, separa as 2 colunas e roda OCR (tesseract, pt-BR)**.

## Requisitos

- `tesseract` com idioma **por** (`tesseract-ocr-por`)
- `poppler-utils` (`pdftoppm`)
- Python 3 + `Pillow`
- Node + `tsx` (já nas devDependencies) para a carga no banco

Se o idioma `por` não estiver no caminho padrão, baixe `por.traineddata` e defina
`TESSDATA_PREFIX` para a pasta que o contém.

## Uso

### 1) Calibrar o offset de página
O sumário usa a numeração do livro; o PDF tem páginas de rosto antes. Neste
exemplar, `pdf_page - book_page = 21` (ex.: Amiodarona VO, livro p. 62 = PDF p. 83).
Confirme abrindo o PDF e ajuste `--page-offset` se necessário.

### 2) OCR + extração estruturada → JSON
```bash
npm run ocr:bulario -- \
  --pdf "caminho/Bulário explicativo - 2ª Edição.pdf" \
  --start 83 --end 90 --dpi 300 \
  --page-offset 21 \
  --out out/lote_083-090.json \
  --raw-out out/raw_083-090.json
```
Processa em lotes de páginas (recomendado 10–30 por vez). O `--raw-out` guarda o
texto OCR bruto para auditoria.

### 3) Carregar no banco (entra como NÃO validado)
```bash
npm run import:bulario -- out/lote_083-090.json
```
Todos os registros entram com `source = BULARIO_OCR` e `reviewed = false`.
Registros já **revisados** nunca são sobrescritos.

### 4) Revisar e aprovar
Abra **/importacao** no app. Para cada fármaco: confira/edite os campos contra a
fonte oficial, classifique a classe terapêutica e clique em **Aprovar como
validado**. Só então o registro aparece na Consulta marcado como *Validado*.

## Campos extraídos

`INDICAÇÕES → indications` · `POSOLOGIA → standardPosology` ·
`CONTRAINDICAÇÕES → contraindications` · `REAÇÕES ADVERSAS → adverseReactions` ·
`INTERAÇÕES → description (prefixo)` · `ARMAZENAMENTO → storage` ·
`APRESENTAÇÕES → presentations`. O texto restante vai para `rawText` (auditoria).

## Limitações conhecidas (por isso a revisão é obrigatória)

- OCR de digitalização a 200 dpi comete erros (acentos, números, "l/1", "0/O").
  **Confira sempre doses e números.**
- Layout de 2 colunas: a separação usa corte central com folga de 2%; páginas com
  tabelas ou figuras podem embaralhar.
- Detecção de cabeçalho é heurística (nome em CAIXA ALTA); pode dividir/juntar
  monografias em casos atípicos — corrigível na tela de revisão.
- Não extrai automaticamente pares de **interação** para o módulo B (risco alto);
  isso permanece curadoria manual.

Veja `sample_output.json` para um exemplo real de saída (páginas 82–84).
