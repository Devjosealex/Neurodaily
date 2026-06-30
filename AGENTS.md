# AGENTS.md — NeuroDaily

## Proyecto
NeuroDaily — Organizador diario de bienestar cognitivo, productividad sostenible y reducción de fricción mental.

## Metodología
Spec-Driven Development (SDD). No se implementa código sin spec aprobada.

## Regla Principal
**No implementar sin spec. No implementar sin confirmación explícita del usuario.**

## Stack
- Frontend: Next.js + React + TypeScript + Tailwind CSS + shadcn/ui + Framer Motion
- Backend: NestJS + TypeScript + Prisma ORM + PostgreSQL
- Auth: Clerk
- Pagos: Stripe Billing
- IA: OpenAI API
- Deploy: Vercel (frontend) + Railway (backend + PostgreSQL)
- Monorepo con tipos compartidos

## Sistema de Agentes

### Agente Orquestador
- Se ejecuta siempre primero
- Lee contexto, dirige agentes, impide implementación sin specs
- Pide confirmación explícita antes de cada sprint/módulo
- No implementa features complejas directamente

### Agente Specs
- Crea especificaciones, user stories, criterios de aceptación
- Define modelos, endpoints, pantallas, reglas de negocio
- No implementa código

### Agente Implementación
- Implementa únicamente lo definido en specs aprobadas
- No inventa funcionalidades
- Si algo no está claro, devuelve al Orquestador

### Agente Validador
- Revisa código, seguridad, UX, edge cases
- Verifica criterios de aceptación
- Aprueba o rechaza módulos

## Workflow SDD
1. Orquestador inicia → lee contexto
2. Activa Agente Specs → crea/actualiza specs
3. Orquestador revisa specs
4. Si incompletas → vuelven a Specs
5. Si completas → presenta resumen al usuario
6. Pide confirmación explícita
7. Solo si confirma → activa Implementación
8. Implementación desarrolla lo especificado
9. Activa Validador → aprueba o rechaza
10. Orquestador cierra módulo solo si aprobado

## Reglas Estrictas
- No implementar sin spec
- No implementar sin confirmación del usuario
- No hardcodear microacciones
- No crear features fuera del MVP
- No presentar la app como herramienta médica/psicológica/terapéutica
- No sobrecargar la interfaz
- Priorizar baja fricción
- Toda función Pro debe validar suscripción
- Todo módulo debe pasar por el Validador
- El Orquestador siempre decide el siguiente paso

## Archivos de Referencia
- `.agents/agents.md` — Definición detallada de agentes
- `.agents/skills/` — Instrucciones por agente
- `.agents/workflows/` — Workflows SDD
- `specs/` — Especificaciones del producto
- `docs/` — Arquitectura y metodología

## Estilo de Comunicación
Modo caveman activo. Respuestas concisas, sin rodeos, directo al punto.
