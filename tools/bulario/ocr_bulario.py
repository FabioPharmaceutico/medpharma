#!/usr/bin/env python3
"""
Pipeline de OCR e extração estruturada do 'Bulário Explicativo' (PDF escaneado).

⚠️  AVISO DE DIREITOS AUTORAIS
O 'Bulário Explicativo' é uma OBRA PUBLICADA E PROTEGIDA POR DIREITOS AUTORAIS.
Esta ferramenta destina-se a extração para uso PESSOAL/INTERNO de referência do
proprietário legítimo do exemplar. A incorporação do conteúdo em produto
distribuído ou comercializado (SaaS, app público) requer LICENÇA/AUTORIZAÇÃO
EXPRESSA da editora. O uso é de responsabilidade do operador.

Uso:
  python3 ocr_bulario.py --pdf caminho.pdf --start 83 --end 83 --out out.json
  python3 ocr_bulario.py --pdf caminho.pdf --start 70 --end 90 --out lote.json --dpi 300

Requer: tesseract (idioma 'por'), pdftoppm (poppler), Pillow.
Defina TESSDATA_PREFIX se o idioma 'por' estiver em pasta não padrão.
"""
import argparse, json, os, re, subprocess, sys, tempfile
from pathlib import Path

# Rótulos de seção reconhecidos -> campo no schema Drug
SECTION_MAP = {
    "INDICAÇÕES": "indications", "INDICAÇÃO": "indications",
    "POSOLOGIA": "standardPosology",
    "CONTRAINDICAÇÕES": "contraindications", "CONTRA-INDICAÇÕES": "contraindications",
    "REAÇÕES ADVERSAS": "adverseReactions", "REAÇÃO ADVERSA": "adverseReactions",
    "INTERAÇÕES": "interactionsText", "INTERAÇÕES MEDICAMENTOSAS": "interactionsText",
    "ARMAZENAMENTO": "storage", "CONSERVAÇÃO": "storage",
    "APRESENTAÇÕES": "presentations", "APRESENTAÇÃO": "presentations",
}
# Seções que ignoramos (ruído para o cadastro clínico)
IGNORE_SECTIONS = {"RECONSTITUIÇÃO/DILUIÇÃO", "SOLUÇÃO COMPATÍVEL", "ESTABILIDADE",
                   "RECONSTITUIÇÃO", "DILUIÇÃO"}

# Subtítulos do bulário que NUNCA são nomes de fármaco. Mapeamos alguns p/ description;
# o resto é ignorado. Usado para evitar falsos cabeçalhos quando o OCR perde o ":".
SUBHEADINGS = {
    "FARMACOCINÉTICA E FARMACODINÂMICA": "_ignore",
    "FARMACOCINÉTICA": "_ignore", "FARMACODINÂMICA": "_ignore",
    "MECANISMO DE AÇÃO": "_ignore", "PROPRIEDADES FARMACOLÓGICAS": "_ignore",
    "PRECAUÇÕES": "_ignore", "PRECAUÇÕES E ADVERTÊNCIAS": "_ignore",
    "ADVERTÊNCIAS": "_ignore", "ADVERTÊNCIAS E PRECAUÇÕES": "_ignore",
    "SUPERDOSAGEM": "_ignore", "SUPERDOSE": "_ignore",
    "GRAVIDEZ E LACTAÇÃO": "_ignore", "USO NA GRAVIDEZ": "_ignore",
    "VIAS DE ADMINISTRAÇÃO": "_ignore", "USO PEDIÁTRICO": "_ignore",
    "USO EM IDOSOS": "_ignore", "CLASSE TERAPÊUTICA": "_ignore",
}


def norm_label(s):
    """Normaliza um rótulo em caixa alta removendo pontuação/acessórios do OCR."""
    return re.sub(r"[^A-ZÁÉÍÓÚÂÊÔÃÕÇ ]", "", s.upper()).strip()

SECTION_RE = re.compile(r"^([A-ZÁÉÍÓÚÂÊÔÃÕÇ][A-ZÁÉÍÓÚÂÊÔÃÕÇ /\-]{2,40}):\s*(.*)$")
# Heading = linha quase toda em maiúsculas, sem ':' final, aceitando vírgulas
HEADING_RE = re.compile(r"^[A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9][A-ZÁÉÍÓÚÂÊÔÃÕÇ0-9 ,.\-+()]{3,60}$")


def run(cmd):
    return subprocess.run(cmd, check=True, capture_output=True, text=True)


def ocr_page(pdf, page, dpi, tmp):
    """Renderiza a página, divide em 2 colunas e faz OCR pt-BR de cada uma."""
    from PIL import Image
    prefix = os.path.join(tmp, f"pg{page}")
    run(["pdftoppm", "-f", str(page), "-l", str(page), "-r", str(dpi), "-gray", pdf, prefix])
    imgs = sorted(Path(tmp).glob(f"pg{page}*.pgm")) or sorted(Path(tmp).glob(f"pg{page}*.ppm"))
    if not imgs:
        return ""
    im = Image.open(imgs[0]); w, h = im.size
    g = int(w * 0.02)
    cols = [im.crop((0, 0, w // 2 + g, h)), im.crop((w // 2 - g, 0, w, h))]
    texts = []
    for i, c in enumerate(cols):
        p = os.path.join(tmp, f"pg{page}_c{i}.png"); c.save(p)
        base = os.path.join(tmp, f"pg{page}_c{i}")
        env = dict(os.environ)
        run(["tesseract", p, base, "-l", "por", "--psm", "4"])
        texts.append(Path(base + ".txt").read_text(encoding="utf-8", errors="ignore"))
    return "\n".join(texts)


def clean(text):
    """Remove artefatos da calha central (': ' e 'i' soltos no fim de linha) e junta hifenização."""
    out = []
    for line in text.splitlines():
        line = re.sub(r"[\s:;iÍ|]+$", "", line.rstrip())  # ruído de gutter no fim
        out.append(line)
    joined = "\n".join(out)
    joined = re.sub(r"-\n(?=[a-záéíóúâêôãõç])", "", joined)  # une palavras hifenizadas
    return joined


def parse_all(pages):
    """Passe único sobre TODAS as páginas do intervalo (estado mantido entre páginas).

    pages: lista de (page:int, source_ref:str, text:str).
    Retorna lista de monografias com campos mapeados."""
    monos = []
    cur = None
    field = None

    def flush():
        nonlocal cur
        if cur and cur.get("_name"):
            monos.append(cur)
        cur = None

    for page, source_ref, text in pages:
        for raw in text.splitlines():
            line = raw.strip()
            if not line:
                continue
            msec = SECTION_RE.match(line)
            if msec:
                label = msec.group(1).strip().upper()
                rest = msec.group(2).strip()
                if label in SECTION_MAP and cur:
                    field = SECTION_MAP[label]
                    cur.setdefault(field, "")
                    if rest:
                        cur[field] += (" " if cur[field] else "") + rest
                    continue
                if label in IGNORE_SECTIONS:
                    field = "_ignore"
                    continue
            # possível cabeçalho (nome do fármaco)
            if HEADING_RE.match(line) and not line.endswith(":") and len(line.split()) <= 8:
                letters = sum(c.isalpha() for c in line)
                # subtítulo conhecido do bulário (sem ':' por falha do OCR) -> não é fármaco
                nl = norm_label(line)
                sub_hit = next((sh for sh in SUBHEADINGS if sh in nl), None)
                sec_hit = next((sc for sc in SECTION_MAP if sc in nl), None)
                if sec_hit:
                    field = SECTION_MAP[sec_hit]; continue
                if sub_hit or any(ig in nl for ig in IGNORE_SECTIONS):
                    field = "_ignore"; continue
                if letters >= max(4, int(len(line) * 0.5)):
                    name = re.sub(r"^[^A-Za-zÁÉÍÓÚÂÊÔÃÕÇ]+", "", line).title().strip()
                    if len(name) < 3:
                        continue
                    # cabeçalho repetido (coluna/página) -> continua o mesmo fármaco
                    if cur and cur.get("_name", "").lower() == name.lower():
                        field = None
                        continue
                    if monos and monos[-1]["_name"].lower() == name.lower():
                        flush(); cur = monos.pop(); field = None; continue
                    flush()
                    cur = {"_name": name, "sourcePage": page, "sourceRef": source_ref}
                    field = None
                    continue
            # texto corrente
            if cur is not None and field and field != "_ignore":
                cur[field] += (" " if cur[field] else "") + line
            elif cur is not None and field != "_ignore":
                cur.setdefault("rawText", "")
                cur["rawText"] += (" " if cur["rawText"] else "") + line
    flush()
    return monos


FIELD_KEYS = ["indications", "standardPosology", "contraindications",
              "adverseReactions", "interactionsText", "storage", "presentations"]


def merge_into(dst, src):
    """Mescla campos de src na monografia dst (mesmo fármaco em páginas diferentes)."""
    for k in FIELD_KEYS + ["_tail", "rawText"]:
        if src.get(k):
            dst[k] = ((dst.get(k) or "") + " " + src[k]).strip()
    return dst


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pdf", required=True)
    ap.add_argument("--start", type=int, required=True)
    ap.add_argument("--end", type=int, required=True)
    ap.add_argument("--dpi", type=int, default=300)
    ap.add_argument("--edition", default="Bulário Explicativo 2ª ed.")
    ap.add_argument("--page-offset", type=int, default=21,
                    help="pdf_page - book_page (para citar a página do livro)")
    ap.add_argument("--out", required=True)
    ap.add_argument("--raw-out", default=None, help="salva também o texto OCR bruto por página")
    args = ap.parse_args()

    pages, raw = [], {}
    with tempfile.TemporaryDirectory() as tmp:
        for pg in range(args.start, args.end + 1):
            book_pg = pg - args.page_offset
            src = f"{args.edition} — p. {book_pg} (PDF {pg})"
            try:
                txt = clean(ocr_page(args.pdf, pg, args.dpi, tmp))
            except subprocess.CalledProcessError as e:
                print(f"[erro] página {pg}: {e.stderr[:200]}", file=sys.stderr); continue
            raw[str(pg)] = txt
            pages.append((pg, src, txt))
            # escrita incremental: re-parseia o acumulado e grava a cada página
            # (parsing é barato; garante progresso persistido mesmo se interrompido)
            partial = parse_all(pages)
            Path(args.out).write_text(json.dumps(partial, ensure_ascii=False, indent=2), encoding="utf-8")
            print(f"[ok] OCR pdf-página {pg} (livro {book_pg}) — {len(partial)} monografias acumuladas", file=sys.stderr)

    all_monos = parse_all(pages)
    print(f"parse: {len(all_monos)} monografias em {len(pages)} páginas", file=sys.stderr)

    Path(args.out).write_text(json.dumps(all_monos, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n{len(all_monos)} monografias -> {args.out}")
    if args.raw_out:
        Path(args.raw_out).write_text(json.dumps(raw, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"texto bruto -> {args.raw_out}")


if __name__ == "__main__":
    main()
