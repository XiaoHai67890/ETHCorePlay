import { ReactNode } from 'react';
import { Card } from './Card';

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  color: string;
  bgGradient: string;
  iconBg: string;
  shadowColor: string;
}

export function MetricCard({ icon, label, value, color, bgGradient, iconBg, shadowColor }: MetricCardProps) {
  return (
    <Card style={{ display: 'flex', alignItems: 'center', gap: '20px', margin: 0, background: bgGradient }}>
      <div style={{ background: iconBg, padding: '16px', borderRadius: '50%', color: color, boxShadow: `0 4px 12px ${shadowColor}` }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
        <div style={{ fontSize: '2.2rem', fontWeight: 700, color: 'var(--primary-hover)', lineHeight: 1.2 }}>{value}</div>
      </div>
    </Card>
  );
}
