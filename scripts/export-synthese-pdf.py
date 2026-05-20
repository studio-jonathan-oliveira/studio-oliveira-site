"""Convert synthèse Jonathan markdown → PDF stylisé Studio Oliveira.

Génère un PDF visuellement soigné (typographie serif élégante, palette vert
mousse/sauge inspirée de la charte Studio Oliveira, cover page, sommaire,
tableaux propres, sauts de page entre sections).
"""

import re
import sys
from pathlib import Path

import markdown
from weasyprint import HTML, CSS
from weasyprint.text.fonts import FontConfiguration


ROOT = Path(__file__).parent.parent
SRC = ROOT / "_brief" / "etude-de-marche" / "00-SYNTHESE-JONATHAN.md"
OUT_PDF = ROOT / "_brief" / "etude-de-marche" / "Etude-Marche-Studio-Oliveira.pdf"
OUT_HTML = ROOT / "_brief" / "etude-de-marche" / "_export.html"


CSS_STYLES = r"""
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400&display=swap');

@page {
  size: A4;
  margin: 22mm 20mm 22mm 20mm;

  @bottom-left {
    content: "Studio J Oliveira — Étude de marché";
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    color: #87926B;
  }

  @bottom-right {
    content: "Page " counter(page) " / " counter(pages);
    font-family: 'Inter', sans-serif;
    font-size: 8pt;
    color: #87926B;
  }
}

@page :first {
  margin: 0;
  @bottom-left { content: none; }
  @bottom-right { content: none; }
}

:root {
  --moss-deep: #1F4332;
  --moss-mid: #2D5A3E;
  --sage: #87926B;
  --sage-light: #B3BB99;
  --cream: #FAF8F3;
  --cream-warm: #F4EFE3;
  --tan: #D4CDB7;
  --charcoal: #2D3A2E;
  --gold: #B8915C;
}

html, body {
  font-family: 'Cormorant Garamond', 'Liberation Serif', serif;
  font-size: 11pt;
  line-height: 1.55;
  color: var(--charcoal);
  background: var(--cream);
  margin: 0;
  padding: 0;
}

.cover {
  page: first;
  page-break-after: always;
  height: 297mm;
  padding: 38mm 25mm;
  background: linear-gradient(180deg, var(--cream) 0%, var(--cream-warm) 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.cover::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4mm;
  background: var(--moss-deep);
}

.cover::after {
  content: "";
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 4mm;
  background: var(--moss-deep);
}

.cover .eyebrow {
  font-family: 'Inter', sans-serif;
  font-size: 10pt;
  font-weight: 500;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--sage);
}

.cover .studio-name {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 500;
  font-size: 18pt;
  color: var(--moss-deep);
  margin-top: 6mm;
  letter-spacing: 0.5px;
}

.cover .title {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 46pt;
  line-height: 1.08;
  color: var(--moss-deep);
  margin-top: 60mm;
  letter-spacing: -0.5px;
}

.cover .subtitle {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 400;
  font-style: italic;
  font-size: 18pt;
  color: var(--sage);
  margin-top: 6mm;
  line-height: 1.3;
}

.cover .rule {
  margin-top: 20mm;
  width: 50mm;
  height: 1pt;
  background: var(--gold);
}

.cover .meta {
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
  color: var(--charcoal);
  margin-top: 8mm;
  line-height: 1.6;
}

.cover .meta strong { color: var(--moss-deep); font-weight: 600; }

.cover .footer {
  font-family: 'Inter', sans-serif;
  font-size: 8pt;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--sage);
}

/* Contenu principal */
.content {
  padding-top: 4mm;
}

h1 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 26pt;
  line-height: 1.15;
  color: var(--moss-deep);
  margin-top: 0;
  margin-bottom: 6mm;
  padding-bottom: 4mm;
  border-bottom: 1pt solid var(--tan);
  page-break-before: auto;
  page-break-after: avoid;
}

h2 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 20pt;
  line-height: 1.2;
  color: var(--moss-deep);
  margin-top: 12mm;
  margin-bottom: 4mm;
  page-break-after: avoid;
  page-break-before: always;
}

/* Pas de saut avant le premier h2 du document */
.content > h2:first-of-type {
  page-break-before: avoid;
}

h2::before {
  content: "";
  display: inline-block;
  width: 4mm;
  height: 1pt;
  background: var(--gold);
  margin-right: 3mm;
  vertical-align: middle;
  margin-bottom: 2mm;
}

h3 {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-size: 15pt;
  color: var(--moss-mid);
  margin-top: 8mm;
  margin-bottom: 3mm;
  page-break-after: avoid;
}

h4 {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 11pt;
  color: var(--moss-deep);
  margin-top: 6mm;
  margin-bottom: 2mm;
  text-transform: uppercase;
  letter-spacing: 1px;
  page-break-after: avoid;
}

p {
  margin: 0 0 3mm 0;
  text-align: justify;
  hyphens: auto;
}

p strong, li strong, td strong {
  color: var(--moss-deep);
  font-weight: 600;
}

em {
  color: var(--sage);
  font-style: italic;
}

a {
  color: var(--moss-mid);
  text-decoration: none;
  border-bottom: 0.5pt dotted var(--sage);
}

ul, ol {
  margin: 2mm 0 4mm 0;
  padding-left: 6mm;
}

li {
  margin-bottom: 1.5mm;
  line-height: 1.5;
}

ul li::marker {
  color: var(--sage);
}

ol li::marker {
  color: var(--moss-mid);
  font-weight: 600;
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
}

/* Tableaux */
table {
  width: 100%;
  border-collapse: collapse;
  margin: 4mm 0 6mm 0;
  font-family: 'Inter', sans-serif;
  font-size: 9pt;
  line-height: 1.4;
  page-break-inside: avoid;
  box-shadow: 0 0 0 0.5pt var(--tan);
  border-radius: 1.5mm;
  overflow: hidden;
}

thead {
  background: var(--moss-deep);
}

thead th {
  color: var(--cream);
  font-weight: 600;
  padding: 3mm 3mm;
  text-align: left;
  font-size: 8.5pt;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-bottom: none;
}

tbody td {
  padding: 2.5mm 3mm;
  border-bottom: 0.4pt solid var(--tan);
  vertical-align: top;
}

tbody tr:nth-child(even) {
  background: rgba(212, 205, 183, 0.18);
}

tbody tr:last-child td {
  border-bottom: none;
}

tbody td strong {
  color: var(--moss-deep);
  font-weight: 600;
}

/* Citations / quote */
blockquote {
  background: var(--cream-warm);
  border-left: 2pt solid var(--gold);
  padding: 3mm 5mm;
  margin: 4mm 0;
  font-style: italic;
  color: var(--moss-mid);
  font-size: 10.5pt;
  page-break-inside: avoid;
}

blockquote strong {
  font-style: normal;
}

/* Code inline */
code {
  font-family: 'JetBrains Mono', 'DejaVu Sans Mono', monospace;
  font-size: 9pt;
  background: var(--cream-warm);
  color: var(--moss-deep);
  padding: 0.4mm 1.2mm;
  border-radius: 0.5mm;
  border: 0.3pt solid var(--tan);
}

pre {
  background: var(--cream-warm);
  border: 0.4pt solid var(--tan);
  border-left: 2pt solid var(--sage);
  padding: 3mm 4mm;
  font-family: 'JetBrains Mono', monospace;
  font-size: 8.5pt;
  line-height: 1.5;
  border-radius: 0.5mm;
  page-break-inside: avoid;
  overflow: hidden;
}

pre code {
  background: none;
  border: none;
  padding: 0;
}

/* Séparateurs <hr> */
hr {
  border: none;
  height: 0.5pt;
  background: var(--tan);
  margin: 8mm 0;
}

/* Forcer page-break-inside avoid sur les "encadrés clés" de cibles */
h4 + p, h4 + ul {
  page-break-before: avoid;
}

/* Footnotes en fin de doc */
.content em em {
  font-style: normal;
  color: var(--charcoal);
  opacity: 0.7;
  font-size: 9pt;
}

/* Premier paragraphe d'une section : pas de retrait justifié dur */
h2 + p, h1 + p {
  text-align: left;
}

/* En-tête de page (le titre du doc) — discret */
.running-title {
  font-family: 'Inter', sans-serif;
  font-size: 7.5pt;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--sage);
}
"""


COVER_HTML = """
<section class="cover">
  <div>
    <div class="eyebrow">Étude de marché — 2026</div>
    <div class="studio-name">Studio J Oliveira</div>
  </div>

  <div>
    <div class="title">Où prospecter,<br/>qui contacter,<br/>comment se faire connaître.</div>
    <div class="subtitle">Synthèse opérationnelle — 8 zones, 3 segments,<br/>un plan d'action sur 12 mois.</div>
    <div class="rule"></div>
    <div class="meta">
      <strong>Destinataire</strong> : Jonathan Oliveira<br/>
      <strong>Préparé par</strong> : Morgan, mai 2026<br/>
      <strong>Méthodologie</strong> : INSEE · Notaires de France · Atout France · Relais &amp; Châteaux · CNOA · Sotheby's · Barnes · presse spécialisée
    </div>
  </div>

  <div class="footer">Designer paysagiste biophilique — Sud-Ouest &amp; Paris</div>
</section>
"""


def build_html(md_text: str) -> str:
    # Retirer le H1 et les 4 premières lignes du markdown source (déjà couverts par la cover)
    lines = md_text.splitlines()
    skip_until = 0
    found_first_h2 = False
    for i, line in enumerate(lines):
        if line.startswith("## ") and not found_first_h2:
            skip_until = i
            found_first_h2 = True
            break
    body_md = "\n".join(lines[skip_until:])

    html_body = markdown.markdown(
        body_md,
        extensions=["tables", "fenced_code", "attr_list", "sane_lists", "smarty"],
    )

    # Échapper les caractères des cellules de tableau qui contiennent des "●●●●"
    # (déjà UTF-8 — rien à faire). Ils s'affichent correctement.

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Studio J Oliveira — Étude de marché</title>
</head>
<body>
{COVER_HTML}
<main class="content">
{html_body}
</main>
</body>
</html>
"""


def main():
    md = SRC.read_text(encoding="utf-8")
    html = build_html(md)
    OUT_HTML.write_text(html, encoding="utf-8")

    font_config = FontConfiguration()
    HTML(string=html, base_url=str(ROOT)).write_pdf(
        target=str(OUT_PDF),
        stylesheets=[CSS(string=CSS_STYLES, font_config=font_config)],
        font_config=font_config,
        presentational_hints=True,
    )
    size_kb = OUT_PDF.stat().st_size // 1024
    print(f"✓ PDF généré : {OUT_PDF} ({size_kb} KB)")


if __name__ == "__main__":
    sys.exit(main())
