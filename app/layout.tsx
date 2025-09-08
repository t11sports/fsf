
import './globals.css';
import Nav from '@/components/Nav';
import SWRegister from '@/components/SWRegister';
import BackgroundSyncStatus from '@/components/BackgroundSyncStatus';
import { getTheme } from '@/app/lib/theme';
export const metadata = { title: 'MNF Squares', description: 'Organizer Dashboard' };
const theme = getTheme();
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900" style={{["--brand-primary" as any]: theme.primary, ["--brand-secondary" as any]: theme.secondary}}>
        <div className="max-w-7xl mx-auto p-6">
          <Nav />
          {children}
          <SWRegister />
          <BackgroundSyncStatus />
        </div>
      </body>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#BA2A2D" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta property="og:title" content="MNF Squares" />
        <meta property="og:description" content="North Lakes Soccer — 2012G Squares Fundraiser" />
        <meta property="og:image" content="https://lirp.cdn-website.com/638a0082/import/clib/nextlevelsoccer_com/dms3rep/multi/opt/nextlevellogo-256x273-202h.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
</html>
  );
}
