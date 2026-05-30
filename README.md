# LearnIA Frontend

Frontend independiente del MVP de LearnIA, construido con Next.js y TypeScript para ofrecer una interfaz enfocada en carga de materiales, chat RAG, generacion y seguimiento de progreso.

## Propósito
Este repositorio concentra la experiencia de usuario, el estado de la interfaz, la composicion visual y el consumo de la API del backend.

## Arquitectura
Se recomienda una **Feature-Based Architecture** con una capa global de componentes compartidos y servicios aislados.

## Patrones de diseño usados
- **Adapter**: adapta respuestas del backend al modelo que necesita la UI sin contaminar componentes con detalles de transporte.
- **Facade**: encapsula operaciones de pantalla o feature para simplificar el uso desde componentes.
- **Strategy**: útil cuando una feature necesita variantes de renderizado, validacion o comportamiento segun contexto.
- **Container / Presentational split**: separa componentes que coordinan datos de los que solo renderizan UI.

## Justificacion
La app frontend tendra varias pantallas y flujos con estados asincronos distintos. Organizarla por features reduce acoplamiento, mejora la escalabilidad del codigo y facilita que cada modulo evolucione de forma independiente.

## Estructura base
- `src/app`: rutas y layout global.
- `src/features`: funcionalidades por dominio.
- `src/components`: componentes reutilizables.
- `src/hooks`: hooks compartidos.
- `src/services`: clientes API y adaptadores.
- `src/store`: estado global.
- `src/layouts`: layouts reutilizables.
- `src/routes`: definicion de rutas.
- `src/shared`: utilidades, tipos y validaciones comunes.
- `src/assets`: recursos estaticos.

## Flujo recomendado
1. `services` consulta al backend.
2. `features` transforma y organiza los datos por caso de uso.
3. `components` renderiza la interfaz.
4. `store` conserva estado compartido cuando realmente sea necesario.

## Convenciones tecnicas
- Mantener el estado global al minimo indispensable.
- Reutilizar componentes solo cuando el comportamiento sea realmente comun.
- Validar formularios con esquemas compartidos.
- Centralizar el acceso a la API en `services`.

## Arranque sugerido
- Instalar dependencias con `npm ci`.
- Configurar variables de entorno del backend.
- Ejecutar lint y build antes de abrir PR.

## Notas utiles
- La UI debe priorizar claridad y feedback visual para cargas y generacion.
- El diseño debe soportar crecimiento por feature sin mezclar responsabilidades.
- TanStack Query y Zustand deben usarse solo donde aporten valor real.
