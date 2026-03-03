import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

export function Card({ children, className = '', style, id }: CardProps) {
  return (
    <div id={id} className={`card ${className}`} style={style}>
      {children}
    </div>
  );
}
