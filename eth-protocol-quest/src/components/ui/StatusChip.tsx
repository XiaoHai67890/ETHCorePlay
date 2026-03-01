export function StatusChip({ status }: { status: 'new'|'learning'|'bloomed' }) {
  const text = status === 'new' ? 'Not started' : status === 'learning' ? 'In progress' : 'Bloomed';
  return <span className="meta-pill">{text}</span>;
}
