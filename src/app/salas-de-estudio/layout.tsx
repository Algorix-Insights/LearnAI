'use client';

import { ReactNode } from 'react';

export default function SalasDeEstudioLayout({ children }: { children: ReactNode }) {
  return (
    <div className="salas-de-estudio-layout">
      {children}
    </div>
  );
}