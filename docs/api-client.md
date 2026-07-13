# Cliente de la API

La integración vive en `src/services`. Todos los servicios usan el mismo cliente Axios, agregan el JWT guardado en `sessionStorage` y normalizan errores en `ApiClientError`.

## Configuración

```bash
cp .env.example .env.local
npm run dev
```

`NEXT_PUBLIC_API_URL` debe contener el origen HTTPS final, sin `/api/v1`:

```dotenv
NEXT_PUBLIC_API_URL=https://learnaiapi.algorixinsights.com
```

Sin variable, el cliente usa la API productiva. Para backend local, cambia el valor a `http://127.0.0.1:8000`. Configúrala explícitamente antes de `next build` para no depender del valor por defecto. El navegador llama directamente a `${NEXT_PUBLIC_API_URL}/api/v1`, sin un proxy intermedio. La variable configura una URL pública, no una credencial: tampoco guardes service-role keys ahí.

Usa siempre `https://` con Railway. Su endpoint `http://` responde `301`; seguir ese redirect puede convertir un `POST` en `GET` y producir `405 Method Not Allowed` en `/auth/register`.

Para Docker, el destino queda incorporado durante el build:

```bash
docker build \
  --build-arg NEXT_PUBLIC_API_URL=https://api.example.com \
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

Estos servicios están diseñados para Client Components y hooks: llaman la URL HTTPS final y leen `sessionStorage`. No los importes directamente en Server Components o Server Actions. Un futuro flujo SSR debe usar un BFF de Next.js con cookies `HttpOnly` y una URL absoluta.

## Autenticación

El backend no crea cookies ni mantiene sesión. Login, registro y verificación OTP devuelven tokens JSON; el interceptor agrega `Authorization: Bearer <access_token>` a cada ruta protegida.

- `saveSession()` guarda `access_token`, `refresh_token`, sesión y expiración en `sessionStorage`.
- `AuthProvider` restaura cada recarga de la pestaña con `GET /users/me` antes de mostrar contenido protegido.
- Usuario autenticado significa `Boolean(access_token)` y `/users/me` válido; un objeto `user` sin token no autentica.
- Registro sin contraseña inicia OTP. Login OTP usa `should_create_user: false`.
- `verifyOtp` acepta exactamente uno de `token` (con `email`) o `token_hash` (desde el Magic Link); nunca envíes ambos.
- Recuperación verifica OTP con `type: "recovery"` y envía ese token solo a `/auth/reset-password`.
- Logout borra siempre almacenamiento y caché local, aunque falle `/auth/logout`.
- No uses `withCredentials`; backend no usa cookies.
- Nunca envíes `user_id` o `created_by`; identidad sale del JWT y RLS.

`AuthProvider` evita mostrar rutas protegidas antes de restaurar sesión, pero es un guard cliente: no coloques datos sensibles en Server Components confiando solo en él. Autorización real sigue en backend mediante JWT, usuario activo y RLS.

No existe `/auth/refresh` todavía. `refresh_token` se conserva para compatibilidad futura, pero al expirar `access_token` usuario debe entrar de nuevo. `sessionStorage` vive por pestaña; una pestaña nueva empieza sin sesión.

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
const documents = await RagService.listDocuments(notebookId, {
  limit: 100,
  offset: 0,
});

await RagService.uploadDocument(notebookId, { file });
```

`POST /documents` está retirado. El servicio conserva el `GET /documents` compatible y filtra el resultado accesible por `notebookId`; upload y eliminación siempre usan las rutas anidadas del cuaderno.

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
- `403` indica usuario suspendido o falta de permisos.
- `422` indica payload inválido; revisa `validationErrors`.
- `429` expone `retryAfterSeconds`; deshabilita la acción durante ese tiempo.
- `503` indica que Supabase Auth no está disponible temporalmente.
- Upload RAG y avatar usan timeout de 120 segundos; chat, generación y calificación IA usan 180 segundos.
- Nunca envíes `user_id`, `created_by`, ownership, `score` o `is_correct`; el backend los deriva del JWT o los calcula.
- No persistas la URL firmada del avatar; solicita otra cuando expire.

El contrato fuente sigue siendo el OpenAPI del backend (`/docs`) y `guia-consumo-api.md`.
