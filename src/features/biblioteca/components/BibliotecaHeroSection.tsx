import Image from 'next/image';
import stars from '@/assets/stars.svg';
import { CreateNotebookDialog } from '@/components/CreateNotebookDialog';

export function BibliotecaHeroSection() {
    return (
        <section>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col items-start gap-8">
                    <div>
                        <h1 className="mt-14 bg-gradient-to-r from-[#28D8C5] to-[#7452F5] bg-clip-text text-4xl text-transparent">
                            Estamos en la Biblioteca
                        </h1>
                        <p className="mt-4 text-md text-gray-500">El centro de aprendizaje</p>
                    </div>

                    <div className="w-full max-w-[700px] space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <label className="flex flex-1 items-center gap-3 rounded-full border border-[color:var(--app-border)] bg-white px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                                <span className="h-4 w-4 shrink-0 rounded-full border-2 border-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Buscar cuadernos, temas o fuentes"
                                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                                />
                            </label>

                            <CreateNotebookDialog
                                triggerLabel="Nuevo cuaderno"
                                triggerClassName="w-full bg-[#7667F2] text-white hover:text-white sm:w-auto"
                            />
                        </div>
                    </div>
                </div>

                <div className="shrink-0">
                    <Image src={stars} alt="Estrellas" className="mt-8" />
                </div>
            </div>
        </section>
    );
}