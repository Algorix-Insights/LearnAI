export type Quote = {
  phrase: string;
  autor: string;
  image?: string; // opcional: ruta a una foto/avatar del autor
};

export const quotes: Quote[] = [
  { phrase: "El esfuerzo de hoy es el éxito del mañana", autor: "Robert Collier" },
  { phrase: "La disciplina es el puente entre metas y logros", autor: "Jim Rohn" },
  { phrase: "No cuentes los días, haz que los días cuenten", autor: "Muhammad Ali" },
  { phrase: "Si no persigues lo que quieres, nunca lo tendrás", autor: "Nora Roberts" },
  { phrase: "El genio es 1% talento y 99% trabajo duro", autor: "Albert Einstein" },
  { phrase: "La mejor manera de predecir el futuro es crearlo", autor: "Peter Drucker" },
  { phrase: "El aprendizaje nunca cansa a la mente", autor: "Leonardo da Vinci" },
  { phrase: "Siempre parece imposible hasta que se hace", autor: "Nelson Mandela" },
];

export function getQuoteOfTheDay(): Quote {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / 86_400_000);
  const index = dayOfYear % quotes.length;
  return quotes[index];
}