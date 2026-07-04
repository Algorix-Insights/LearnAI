import Link from 'next/link';

import { AppShell } from '@/layouts/app-shell';

export default function BibliotecaPage() {
  return (
    <AppShell activeHref="/biblioteca">
      <section className="grid min-h-[60vh] place-items-center rounded-[2rem] border border-[color:var(--app-border)] bg-white/80 p-8 text-center shadow-[0_10px_40px_rgba(15,23,42,0.04)]">
        <div className="max-w-xl space-y-4">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-[linear-gradient(135deg,var(--app-secondary),var(--app-primary))]" />
          <h1 className="text-3xl font-semibold text-slate-800">Biblioteca</h1>
          <p className="text-sm leading-6 text-slate-500">
            Aquí puedes mostrar apuntes, documentos y recursos guardados.
          </p>
          <Link href="/home" className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white">
            Volver al inicio
          </Link>
        </div>
      </section>
    </AppShell>
  );
}