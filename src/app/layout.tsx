import type { ReactNode } from 'react';

import '@/globals.css';
import { Geist, Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Providers from '@/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });


export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body className=" text-slate-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
