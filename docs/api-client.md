# Cliente de la API

La integración vive en `src/services`. Todos los servicios usan el mismo cliente Axios, agregan el JWT de la cookie `learnai_auth_token` y normalizan errores en `ApiClientError`.

## Configuración

```bash
cp .env.example .env.local
npm run dev
```

`LEARNIA_API_BASE_URL` debe contener la URL completa, incluido `/api/v1`:

```dotenv
LEARNIA_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

En `next dev`, la ausencia de la variable usa `http://127.0.0.1:8000/api/v1`; en builds de producción usa la API productiva. Configúrala explícitamente antes de `next build` para no depender de ese valor por defecto. Next expone el API por `/backend/*`, evitando depender de CORS y manteniendo el host real fuera del bundle del navegador. La variable configura una URL, no una credencial: tampoco guardes service-role keys ahí.

Para Docker, el destino queda incorporado durante el build:

```bash
docker build \
  --build-arg LEARNIA_API_BASE_URL=https://api.example.com/api/v1 \
  -t learnia-frontend .
```

## Servicios disponibles

| Dominio | Import | Operaciones principales |
| --- | --- | --- |
| Auth | `@/services/Auth` | registro, login, OTP, recuperación, logout, usuario actual |
| Perfil | `@/services/User` | perfil y foto temporal |
| Cuadernos | `@/services/Notebook` | listado, CRUD, asociar/desasociar tags |
| Tags | `@/services/Tag` | catálogo, creación y asociación |
| Salas | `@/services/Room` | listado, CRUD y asociación de cuadernos |
| Estadísticas | `@/services/Statistics` | dashboard y eventos idempotentes |
| RAG | `@/services/Rag` | fuentes, conversaciones, chat y flashcards |
| Exámenes | `@/services/Exam` | generación, intentos, respuestas y calificación |
| Tipos | `@/services/contracts` | payloads y respuestas públicas |

Los recursos individuales regresan el objeto ya extraído de `{ data }`. Los listados conservan `{ data, limit, offset }`. Chat y generaciones conservan `{ data, sources }` para no perder citas.

Estos servicios están diseñados para Client Components y hooks: usan `/backend` relativo y leen la cookie desde `document`. No los importes directamente en Server Components o Server Actions; para ese caso crea un adaptador server-side que lea `cookies()` y use una URL absoluta.

## Ejemplos

```ts
import { NotebookService } from '@/services/Notebook';

const page = await NotebookService.list({ limit: 20, offset: 0 });
const notebook = await NotebookService.create({
  name: 'Estructuras de datos',
  due_date: '2026-07-30T23:59:00Z',
});
```

```ts
import { RagService } from '@/services/Rag';

const result = await RagService.sendMessage(conversationId, {
  content: 'Resume mis apuntes',
});

console.log(result.data.content, result.sources);
```

```ts
import { StatisticsService } from '@/services/Statistics';

const key = crypto.randomUUID();
await StatisticsService.recordLearningEvent(
  {
    notebook_id: notebookId,
    activity_type: 'study_session',
    quantity: 1,
    duration_seconds: 1800,
  },
  key,
);
```

Conserva la misma clave de idempotencia al reintentar el mismo evento.

## React Query

```tsx
const notebooks = useQuery({
  queryKey: ['notebooks'],
  queryFn: () => NotebookService.list({ limit: 100, offset: 0 }),
});
```

`Providers.tsx` evita reintentos automáticos para errores `4xx` y `429`. Tras una mutación, invalida la clave relacionada.

## Errores y cuotas

```ts
import { ApiClientError } from '@/services/api';
import { RagService } from '@/services/Rag';

try {
  await RagService.generateFlashcards(notebookId, { count: 10 });
} catch (error) {
  if (error instanceof ApiClientError) {
    console.error(error.status, error.message);
    console.error(error.validationErrors);
    console.error(error.retryAfterSeconds);
  }
}
```

- `401` elimina la sesión vencida y redirige a login.
- `429` expone `retryAfterSeconds`; deshabilita la acción durante ese tiempo.
- Upload RAG y avatar usan timeout de 120 segundos; chat, generación y calificación IA usan 180 segundos.
- Nunca envíes `user_id`, `created_by`, ownership, `score` o `is_correct`; el backend los deriva del JWT o los calcula.
- No persistas la URL firmada del avatar; solicita otra cuando expire.

El contrato fuente sigue siendo el OpenAPI del backend (`/docs`) y `guia-consumo-api.md`.
