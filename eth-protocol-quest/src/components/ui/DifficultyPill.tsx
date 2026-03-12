export function DifficultyPill({ level }: { level: 1|2|3|4|5 }) {
  return <span className="meta-pill">难度 {level}/5</span>;
}
