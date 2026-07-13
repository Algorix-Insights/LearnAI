import { BibliotecaContent } from '@/features/biblioteca/components/BibliotecaContent';
import { requireAuth } from '@/lib/require-auth';
import { AppShell } from '@/layouts/app-shell';

export default async function BibliotecaPage() {
  await requireAuth();

  return (
    <AppShell activeHref="/biblioteca">
      <BibliotecaContent />
    </AppShell>
  );
}
