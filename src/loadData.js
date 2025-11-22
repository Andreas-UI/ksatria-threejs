export async function loadData() {
  const sheetId = "1mrUP-A7IyX0oe8AHjIsmWjEGbxqH3d7Ny_yFV_b78_M";
  const gid = "1495835494";

  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;

  const res = await fetch(url);
  const text = await res.text();

  // Strip wrapper
  const json = JSON.parse(text.substring(47, text.length - 2));

  const rows = json.table.rows;

  // Output becomes:
  // [["Name","Photo","Age","Country","Interest","NetWorth"], ...]
  return rows.map(r => r.c.map(c => c?.v ?? ""));
}
