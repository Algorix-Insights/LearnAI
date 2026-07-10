import type { ReactNode } from 'react';

import './globals.css';
import { Geist, Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es" className={cn("font-sans", inter.variable)}>
      <body className="bg-[color:var(--app-bg)] text-slate-900 antialiased">{children}</body>
    </html>
  );
}
