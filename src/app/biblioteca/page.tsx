import { BibliotecaContent } from '@/features/biblioteca/components/BibliotecaContent';
import { AppShell } from '@/layouts/app-shell';

export default function BibliotecaPage() {
  return (
    <AppShell activeHref="/biblioteca">
      <BibliotecaContent />
    </AppShell>
  );
}
