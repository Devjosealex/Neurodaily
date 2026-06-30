# Metodología SDD — NeuroDaily

## Spec-Driven Development

### Principio Core
**No se implementa código sin especificación aprobada.**

### ¿Por Qué SDD?
1. **Previene scope creep** — solo se implementa lo especificado
2. **Reduce retrabajo** — los problemas se detectan en specs, no en código
3. **Facilita validación** — criterios de aceptación claros desde el inicio
4. **Mejora comunicación** — el usuario sabe exactamente qué se va a construir
5. **Controla la IA** — la IA no inventa features sin aprobación

### Flujo SDD

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ ESPECIFICAR │ ──→ │  CONFIRMAR  │ ──→ │ IMPLEMENTAR │
│ (Agente     │     │ (Usuario    │     │ (Agente     │
│  Specs)     │     │  aprueba)   │     │  Implement) │
└─────────────┘     └─────────────┘     └──────┬──────┘
       ↑                                        │
       │            ┌─────────────┐             │
       └────────────│  VALIDAR    │ ←───────────┘
        (si falta   │ (Agente     │
         spec)      │  Validador) │
                    └─────────────┘
```

### Reglas SDD

1. **Spec antes de código** — Siempre
2. **Confirmación antes de implementar** — Siempre
3. **Validación antes de cerrar** — Siempre
4. **Sin atajos** — El Orquestador no permite saltar pasos
5. **Specs completas** — Todas las secciones requeridas

### Estructura de Specs

```
specs/
├── product/
│   ├── vision.md          # Visión del producto
│   ├── mvp-scope.md       # Alcance del MVP
│   └── non-goals.md       # Lo que NO se hace
├── features/
│   ├── [feature].md       # Una spec por feature
│   └── ...
├── api/
│   └── endpoints.md       # Todos los endpoints
├── database/
│   └── schema.md          # Schema completo
├── ui/
│   └── screens.md         # Todas las pantallas
└── validation/
    └── acceptance-criteria.md  # Criterios generales
```

### Formato de Spec de Feature

Cada spec de feature DEBE incluir:

| Sección | Obligatoria | Contenido |
|---|---|---|
| Descripción | ✅ | Qué hace y por qué |
| User Stories | ✅ | Como [rol], quiero [acción], para [beneficio] |
| Modelo de Datos | ✅ | Campos, tipos, relaciones |
| Endpoints | ✅ | Método, ruta, request, response, errores |
| Pantallas | ✅ | Qué muestra, estados |
| Reglas de Negocio | ✅ | Lógica, condiciones |
| Restricciones por Plan | ✅ | Free vs Pro |
| Edge Cases | ✅ | Qué pasa si... |
| Criterios de Aceptación | ✅ | Checklist verificable |
| Dependencias | ✅ | Qué módulos necesita |

### Ciclo de Sprint SDD

```
1. Orquestador revisa specs del sprint
2. Orquestador presenta plan al usuario
3. Usuario confirma
4. Implementación ejecuta según specs
5. Validador revisa
6. Si aprobado → cierre
7. Si rechazado → corregir (código o spec)
```

### Frase de Confirmación Obligatoria

Antes de implementar:

> "¿Confirmas que proceda con la implementación de este sprint?"

Sin esta confirmación explícita, el sprint queda detenido.

### Anti-Patrones a Evitar

| Anti-Patrón | Regla |
|---|---|
| Implementar sin spec | ❌ PROHIBIDO |
| Agregar features no especificadas | ❌ PROHIBIDO |
| Saltar validación | ❌ PROHIBIDO |
| Implementar sin confirmación | ❌ PROHIBIDO |
| Over-engineering | ❌ PROHIBIDO — MVP first |
| Hardcodear datos administrables | ❌ PROHIBIDO |
| Lenguaje médico/terapéutico | ❌ PROHIBIDO |
