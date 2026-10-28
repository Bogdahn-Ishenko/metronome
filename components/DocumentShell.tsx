import { PreferencesProvider } from '@/components/PreferencesProvider';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';

export default function DocumentShell({
  children,
  language,
}: {
  children: React.ReactNode;
  language: string;
}) {
  return (
    <html lang={language}>
      <body>
        <PreferencesProvider>
          <div className="shell">
            <SiteHeader />
            {children}
            <SiteFooter />
          </div>
        </PreferencesProvider>
      </body>
    </html>
  );
}
