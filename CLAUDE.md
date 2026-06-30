# CLAUDE.md — NeuroDaily

## Qué es
NeuroDaily: organizador diario de bienestar cognitivo y productividad sostenible. No es app médica.

## Metodología
SDD (Spec-Driven Development). No implementar sin spec aprobada ni confirmación del usuario.

## Stack
- Frontend: Next.js, React, TypeScript, Tailwind, shadcn/ui, Framer Motion
- Backend: NestJS, TypeScript, Prisma, PostgreSQL
- Auth: Clerk | Pagos: Stripe | IA: OpenAI
- Deploy: Vercel + Railway | Monorepo

## Agentes
1. **Orquestador** — Dirige todo. Confirma antes de implementar.
2. **Specs** — Crea especificaciones. No implementa.
3. **Implementación** — Solo implementa lo especificado.
4. **Validador** — Revisa y aprueba/rechaza.

## Reglas Clave
- Sin spec → sin código
- Sin confirmación del usuario → sin implementación
- No hardcodear microacciones (viven en DB)
- No crear features fuera del MVP
- No lenguaje médico/terapéutico
- Baja fricción siempre
- Validar suscripción para features Pro
- Validar que usuario no acceda datos de otro usuario

## Producto Core
Botón "¿Qué hago ahora?" → decide según estado, tareas, energía, ansiedad, contexto.
Modo Primer Paso → descompone tareas vagas en acciones microscópicas.
Microacciones guiadas → actividades breves desde DB, editables por admin.

## Planes
- Free: 5 tareas activas, 3 usos "¿Qué hago ahora?"/día, 3 Primer Paso/día, microacciones básicas, historial 7 días
- Pro: ilimitado, IA, estadísticas, patrones, personalización completa

## Referencia
Ver `AGENTS.md`, `.agents/`, `specs/`, `docs/` para detalle completo.
