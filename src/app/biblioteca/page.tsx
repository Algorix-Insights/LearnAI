import { AppShell } from '@/layouts/app-shell';
import { BibliotecaHeroSection } from '@/features/biblioteca/components/BibliotecaHeroSection';
import { BibliotecaPageContent } from '@/features/biblioteca/components/BibliotecaPageContent';
import { requireAuth } from '@/lib/require-auth';

const filters = ['Todos', 'Vencen pronto', 'Favoritos'];

export default async function BibliotecaPage() {
  await requireAuth();

  return (
    <AppShell activeHref="/biblioteca">
      <div className="space-y-8 pb-4 flex flex-col gap-8">
        <BibliotecaHeroSection />
        <BibliotecaPageContent filters={filters} />
      </div>
    </AppShell>
  );
}