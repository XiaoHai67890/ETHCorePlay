'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TopNav() {
  const pathname = usePathname();
  const items: Array<[string, string]> = [
    ['/', 'Dashboard'],
    ['/upgrade/fusaka', 'Upgrade'],
    ['/eip/4844', 'EIP'],
    ['/meeting/acde-201', 'Meeting'],
    ['/search', 'Search'],
    ['/watchlist', 'Watchlist']
  ];
  return (
    <nav className="nav">
      {items.map(([href, label]) => (
        <Link key={href} href={href} className={pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}>{label}</Link>
      ))}
    </nav>
  );
}

export function KV({ k, v }: { k: string; v: any }) {
  return <div style={{ marginBottom: 6 }}><span className="sub" style={{ marginRight: 6 }}>{k}:</span><b>{String(v ?? '-')}</b></div>;
}
