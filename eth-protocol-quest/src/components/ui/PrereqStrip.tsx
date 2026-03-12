export function PrereqStrip({ items }: { items: {id:string; title:string}[] }) {
  if (!items.length) return null;
  return <small className="subtle">Prereqs: {items.map((x)=>x.title).join(' / ')}</small>;
}
