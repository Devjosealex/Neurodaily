# Workflow: Ciclo de Sprint — NeuroDaily

## Trigger
Inicio de cada sprint.

## Pre-requisitos
- Sprint anterior cerrado y aprobado (excepto Sprint 0)
- Specs del sprint actual completas

## Flujo

### Fase 1: Planificación
```
1. Orquestador revisa specs del sprint
2. Orquestador lista:
   - Objetivo del sprint
   - Specs relacionadas
   - Tareas técnicas
   - Archivos a crear/modificar
   - Criterios de aceptación
   - Riesgos
   - Qué NO se implementa todavía
3. Orquestador presenta plan al usuario
4. Orquestador pide confirmación:
   "¿Confirmas que proceda con la implementación de este sprint?"
5. ESPERAR confirmación explícita
```

### Fase 2: Implementación (Solo con Confirmación)
```
1. Agente Implementación recibe specs aprobadas
2. Implementa módulo por módulo
3. Sigue orden de dependencias
4. No inventa features
5. Documenta archivos creados/modificados
6. Marca módulo como listo para validación
```

### Fase 3: Validación
```
1. Agente Validador revisa cada módulo
2. Usa formato de validación obligatorio
3. Estado: Aprobado / No Aprobado
4. Si No Aprobado:
   - Error técnico → devuelve a Implementación
   - Falta de definición → devuelve a Specs
5. Si Aprobado → notifica al Orquestador
```

### Fase 4: Cierre
```
1. Orquestador verifica que TODOS los módulos del sprint estén aprobados
2. Genera reporte de sprint:
   - Objetivo: cumplido / parcial
   - Módulos: lista con estado
   - Archivos: creados y modificados
   - Tests: ejecutados y resultado
   - Siguiente sprint recomendado
3. Cierra sprint
```

## Sprints del MVP

| Sprint | Objetivo | Deps |
|---|---|---|
| 0 | Contexto, agentes, specs | Ninguna |
| 1 | Base SaaS (monorepo, Next, Nest, Prisma, Clerk) | Sprint 0 |
| 2 | Onboarding, tareas, check-in | Sprint 1 |
| 3 | Microacciones | Sprint 2 |
| 4 | Recomendador | Sprint 2 + 3 |
| 5 | Modo Primer Paso | Sprint 2 |
| 6 | Admin | Sprint 3 |
| 7 | Suscripción | Sprint 1 |
| 8 | Validación y deploy | Todos |

## Regla
Sin confirmación explícita del usuario → sprint detenido.
