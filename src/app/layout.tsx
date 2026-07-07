import type { ReactNode } from 'react';

import './globals.css';

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body className="bg-[color:var(--app-bg)] text-slate-900 antialiased">{children}</body>
    </html>
  );
}
