import './globals.css';
import { TopNav } from './components';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="top">
          <div className="top-inner">
            <div className="brand">Eth Upgrade Radar</div>
            <TopNav />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
