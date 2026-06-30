# Agentes — NeuroDaily

## Arquitectura de Agentes

Este proyecto usa 4 agentes como roles de IA. No son procesos autónomos — son instrucciones persistentes que definen comportamiento según la fase del desarrollo.

Los archivos Markdown en `.agents/skills/` contienen las instrucciones detalladas de cada agente.
Los archivos en `.agents/workflows/` definen los flujos de trabajo.

## Agentes Disponibles

### 1. Orquestador (`skills/orchestrator.md`)
- **Prioridad:** Se ejecuta SIEMPRE primero
- **Rol:** Director del proyecto
- **Puede:** Leer contexto, dirigir agentes, pedir confirmación, revisar consistencia
- **No puede:** Implementar features complejas directamente

### 2. Agente Specs (`skills/specs-agent.md`)
- **Prioridad:** Segundo después del Orquestador
- **Rol:** Creador de especificaciones
- **Puede:** Crear specs, user stories, criterios de aceptación, modelos, endpoints
- **No puede:** Implementar código

### 3. Agente Implementación (`skills/implementation-agent.md`)
- **Prioridad:** Solo después de specs aprobadas + confirmación del usuario
- **Rol:** Desarrollador
- **Puede:** Crear código según specs
- **No puede:** Inventar features, modificar alcance, implementar sin confirmación

### 4. Agente Validador (`skills/validator-agent.md`)
- **Prioridad:** Después de cada implementación
- **Rol:** Revisor y QA
- **Puede:** Revisar código, aprobar/rechazar, identificar errores
- **No puede:** Implementar correcciones (las devuelve a Implementación)

## Flujo de Activación

```
Orquestador → Specs → [Revisión] → [Confirmación Usuario] → Implementación → Validador → [Aprobación/Rechazo]
```

## Regla de Oro
Ningún agente puede saltar el flujo. El Orquestador controla la secuencia.
