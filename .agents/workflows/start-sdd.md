# Workflow: Iniciar SDD — NeuroDaily

## Trigger
Inicio de proyecto o nuevo módulo mayor.

## Pasos

### 1. Orquestador Lee Contexto
```
Leer: AGENTS.md → CLAUDE.md → .agents/agents.md → docs/ → specs/
Identificar: estado actual del proyecto, módulos completados, pendientes
```

### 2. Orquestador Evalúa Siguiente Paso
```
¿Hay specs pendientes? → Activar Agente Specs
¿Hay specs completas sin implementar? → Preparar confirmación
¿Hay implementación sin validar? → Activar Validador
¿Todo validado? → Cerrar sprint, planear siguiente
```

### 3. Agente Specs Crea Documentos
```
Para cada feature del sprint:
  - Crear spec en specs/features/
  - Incluir: user stories, modelo, endpoints, pantallas, reglas, edge cases, criterios
  - Marcar restricciones Free/Pro
```

### 4. Orquestador Revisa Specs
```
Verificar completitud de cada sección
Si incompleta → devolver a Specs
Si completa → preparar resumen para usuario
```

### 5. Orquestador Solicita Confirmación
```
Formato:
  1. Qué se va a implementar
  2. Archivos a crear/modificar
  3. Specs que respaldan
  4. Riesgos
  5. Qué queda fuera
  6. "¿Confirmas que proceda?"
```

### 6. Implementación (Solo con Confirmación)
```
Implementar según specs
Entregar lista de archivos creados/modificados
Marcar como listo para validación
```

### 7. Validación
```
Validador revisa según criterios
Aprueba o rechaza
Si rechaza → vuelve a Implementación o Specs
```

### 8. Cierre
```
Orquestador cierra módulo/sprint
Actualiza estado del proyecto
Planea siguiente paso
```

## Regla
Este workflow se ejecuta al inicio de CADA sesión de trabajo.
