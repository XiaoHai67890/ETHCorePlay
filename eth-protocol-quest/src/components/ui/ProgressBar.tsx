interface ProgressBarProps {
  progress: number;
  label?: string;
}

export function ProgressBar({ progress, label }: ProgressBarProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
      <div style={{ flex: 1, background: '#e6f1e8', borderRadius: 10, height: 8, overflow: 'hidden' }}>
        <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#4a8f61,#5a76dc)' }} />
      </div>
      {label && (
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--primary-hover)' }}>
          {label}
        </span>
      )}
    </div>
  );
}
