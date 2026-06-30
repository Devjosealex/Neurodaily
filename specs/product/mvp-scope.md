# Alcance del MVP — NeuroDaily

## Módulos Incluidos en MVP

### Módulos Públicos
1. Landing page
2. Pricing
3. Registro/Login (Clerk)
4. Términos y condiciones
5. Política de privacidad

### Módulos Autenticados (Usuario)
6. Onboarding de preferencias
7. Dashboard diario
8. Check-in diario (3 niveles: rápido/normal/detallado)
9. Gestión de tareas (CRUD + carga cognitiva)
10. Botón "¿Qué hago ahora?"
11. Modo Primer Paso (4 niveles de dificultad)
12. Microacciones guiadas (con temporizador)
13. Feedback posterior a microacciones
14. Motor básico de recomendación (reglas, no IA compleja)
15. Modo "No quiero pensar, ayúdame"
16. Historial simple
17. Configuración personal
18. Gestión de suscripción
19. Streaks (racha de uso)

### Módulos Admin
20. CRUD de microacciones
21. Activar/desactivar microacciones
22. Marcar microacciones como premium
23. Gestionar categorías
24. Ver feedback de usuarios
25. Ver logs de recomendaciones

## Límites por Plan

| Feature | Free | Pro |
|---|---|---|
| Tareas activas | 5 | Ilimitadas |
| Check-ins | 1/día | Ilimitados (re-check) |
| "¿Qué hago ahora?" | 3/día | Ilimitado |
| Modo Primer Paso | 3/día | Ilimitado |
| "Dame algo más fácil" | 1 nivel | 4 niveles |
| Microacciones | Respiración + 2 random | Todas |
| IA (descomponer tareas) | ❌ | ✅ |
| Historial | 7 días | 90 días |
| Estadísticas semanales | ❌ | ✅ |
| Patrones productividad | ❌ | ✅ |
| Rutinas estudio | ❌ | ✅ |
| "No quiero pensar" | 1/día | Ilimitado |
| Personalización avanzada | ❌ | ✅ |
| Categorías de tarea | 3 | 7+ |
| Exportar datos | ❌ | ✅ |

## Orden de Sprints

| Sprint | Contenido | Dependencia |
|---|---|---|
| 0 | Contexto, agentes, specs | — |
| 1 | Base SaaS (monorepo, Next, Nest, Prisma, Clerk) | 0 |
| 2 | Onboarding, tareas, check-in | 1 |
| 3 | Microacciones | 2 |
| 4 | Recomendador | 2+3 |
| 5 | Modo Primer Paso | 2 |
| 6 | Admin | 3 |
| 7 | Suscripción (Stripe) | 1 |
| 8 | Validación y deploy | Todos |

## Pricing
- Free: $0
- Pro Mensual: $7.99 - $9.99/mes
- Pro Anual: $59.99/año (~$5/mes, ~40% descuento)
