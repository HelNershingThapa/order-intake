export type CsvRow = Record<string, string>;

// Simple CSV parser supporting quoted fields with commas and new lines within quotes
export function parseCSV(content: string): {
  headers: string[];
  rows: CsvRow[];
} {
  const rows: CsvRow[] = [];
  const headers: string[] = [];

  // Stateful parser
  const lines: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    if (c === '"') {
      if (inQuotes && content[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === "\n" && !inQuotes) {
      lines.push(current);
      current = "";
    } else if (c === "\r") {
      // ignore CR (will handle on \n)
      continue;
    } else {
      current += c;
    }
  }
  if (current) lines.push(current);

  const split = (line: string) => {
    const cells: string[] = [];
    let cell = "";
    let q = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (q && line[i + 1] === '"') {
          cell += '"';
          i++;
        } else {
          q = !q;
        }
      } else if (ch === "," && !q) {
        cells.push(cell.trim());
        cell = "";
      } else {
        cell += ch;
      }
    }
    cells.push(cell.trim());
    return cells;
  };

  if (lines.length === 0) return { headers: [], rows: [] };

  const headerCells = split(lines[0]);
  headerCells.forEach((h, idx) => {
    const name = h || `col_${idx + 1}`;
    headers.push(name);
  });

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cells = split(lines[i]);
    const row: CsvRow = {};
    headers.forEach((h, idx) => (row[h] = cells[idx] ?? ""));
    rows.push(row);
  }
  return { headers, rows };
}
