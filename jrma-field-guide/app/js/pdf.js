// Minimal one-or-more-page text PDF (US Letter, Courier). No dependencies.
// Courier is a fixed-width built-in PDF font, so line wrapping is a character count.
// Lines: { text, style: 'title' | 'head' | 'body' | 'alert' }

const PAGE_W = 612, PAGE_H = 792, MARGIN = 54;
const STYLE = {
  title: { font: 'F2', size: 18, gap: 26 },
  head: { font: 'F2', size: 13, gap: 20 },
  alert: { font: 'F2', size: 13, gap: 18 },
  body: { font: 'F1', size: 12, gap: 15 },
};

// Courier glyphs are 0.6 em wide.
export function wrap(text, size) {
  const max = Math.floor((PAGE_W - 2 * MARGIN) / (size * 0.6));
  const out = [];
  for (const para of String(text).split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      if (!line) line = word;
      else if (line.length + 1 + word.length <= max) line += ' ' + word;
      else { out.push(line); line = word; }
      while (line.length > max) { out.push(line.slice(0, max)); line = line.slice(max); }
    }
    out.push(line);
  }
  return out;
}

// PDF strings: escape \ ( ) and keep to printable ASCII (fax-safe).
function pdfString(s) {
  return '(' + s.replace(/[^\x20-\x7e]/g, '?').replace(/[\\()]/g, c => '\\' + c) + ')';
}

function layout(lines) {
  const pages = [[]];
  let y = PAGE_H - MARGIN;
  for (const { text, style = 'body' } of lines) {
    const st = STYLE[style];
    for (const row of wrap(text, st.size)) {
      if (y - st.gap < MARGIN) { pages.push([]); y = PAGE_H - MARGIN; }
      y -= st.gap;
      pages[pages.length - 1].push({ row, st, y });
    }
  }
  return pages;
}

export function buildPdf(lines) {
  const pages = layout(lines);
  const objs = [];  // index i holds object number i+1
  const add = body => { objs.push(body); return objs.length; };

  const catalog = add('');        // 1, filled below
  const pagesObj = add('');       // 2, filled below
  const f1 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>');
  const f2 = add('<< /Type /Font /Subtype /Type1 /BaseFont /Courier-Bold /Encoding /WinAnsiEncoding >>');
  const kids = [];
  pages.forEach((page, i) => {
    const footer = { row: `Page ${i + 1} of ${pages.length}`, st: { font: 'F1', size: 9 }, y: MARGIN - 24 };
    const ops = [...page, footer].map(({ row, st, y }) => `BT /${st.font} ${st.size} Tf ${MARGIN} ${y} Td ${pdfString(row)} Tj ET`).join('\n');
    const content = add(`<< /Length ${ops.length} >>\nstream\n${ops}\nendstream`);
    kids.push(add(`<< /Type /Page /Parent ${pagesObj} 0 R /MediaBox [0 0 ${PAGE_W} ${PAGE_H}] /Resources << /Font << /F1 ${f1} 0 R /F2 ${f2} 0 R >> >> /Contents ${content} 0 R >>`));
  });
  objs[catalog - 1] = `<< /Type /Catalog /Pages ${pagesObj} 0 R >>`;
  objs[pagesObj - 1] = `<< /Type /Pages /Kids [${kids.map(k => `${k} 0 R`).join(' ')}] /Count ${kids.length} >>`;

  let out = '%PDF-1.4\n';
  const offsets = [];
  objs.forEach((body, i) => { offsets.push(out.length); out += `${i + 1} 0 obj\n${body}\nendobj\n`; });
  const xref = out.length;
  out += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n`;
  for (const o of offsets) out += `${String(o).padStart(10, '0')} 00000 n \n`;
  out += `trailer\n<< /Size ${objs.length + 1} /Root ${catalog} 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  // Every character is ASCII, so string length equals byte length and the xref offsets hold.
  return new TextEncoder().encode(out);
}
