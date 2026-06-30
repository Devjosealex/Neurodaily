# Especificaciones — Sprint 5: IA y "Primer Paso" (OpenAI)

## User Stories
- Como usuario, cuando tengo una tarea muy grande o vaga, quiero presionar "Primer Paso" para que la IA me sugiera la acción más pequeña y ridículamente fácil para empezar.
- Como usuario Free, quiero que el sistema me ofrezca pasos predefinidos seguros si intento usar la IA (Fallback).
- Como usuario Pro, quiero que la IA entienda el contexto de mi tarea y me dé un micro-paso altamente personalizado.

## Reglas de Negocio
1. **Fallback Seguro (Usuarios Free):**
   - Si el usuario no tiene plan Pro, no se llama a la API de OpenAI.
   - El sistema devuelve una de las 5 reglas de contingencia predefinidas (ej. "Abre el documento y escribe solo el título").
2. **Motor de IA (Usuarios Pro):**
   - Se utiliza `gpt-4o-mini` (rápido, bajo costo, altamente capaz para tareas textuales cortas).
   - El prompt del sistema debe instruir a la IA a ser extremadamente concisa (máximo 15 palabras) y enfocarse en reducir la carga cognitiva.
   - Se debe inyectar el título de la tarea, la categoría y la carga cognitiva en el prompt.
3. **Registro (Logs):**
   - Cada vez que se usa el motor (IA o Fallback), se debe guardar un registro en la tabla `FirstStepLog` de Prisma para análisis futuro.

## Endpoints (Backend - NestJS)
- `POST /first-step/generate`
  - Body: `{ taskId: string }`
  - Auth: Requiere token Clerk.
  - Lógica: Verifica si el usuario es Pro. Si sí, llama a OpenAI. Si no, usa Fallback. Guarda el log y devuelve el paso.

## Pantallas (Frontend - Next.js)
- En el modal de tareas o al ver detalles de una tarea, agregar el botón "💡 Necesito el Primer Paso".
- Al recibir la sugerencia, permitir al usuario "Aceptar" (marcar en el log y actualizar la tarea actual) o "Rechazar" (pedir otra).

## Criterios de Aceptación
1. La API de OpenAI solo se dispara si `user.subscription.plan === 'pro'`.
2. Las respuestas de la IA no deben superar las 15-20 palabras.
3. El frontend debe mostrar un estado de "pensando" atractivo visualmente mientras OpenAI responde.
