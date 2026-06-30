# Workflow: Ciclo de Validación — NeuroDaily

## Trigger
Módulo implementado y marcado como listo para validación.

## Flujo

### 1. Recibir Módulo
```
Input: nombre del módulo, spec de referencia, archivos implementados
```

### 2. Cargar Criterios
```
Leer: specs/features/[feature].md → sección "Criterios de Aceptación"
Leer: specs/validation/acceptance-criteria.md → criterios generales
```

### 3. Revisión de Código
```
Para cada archivo implementado:
  - ¿Sigue la spec?
  - ¿TypeScript estricto?
  - ¿Validación de input?
  - ¿Manejo de errores?
  - ¿Estados vacíos?
```

### 4. Revisión de Seguridad
```
- [ ] Auth guards en todos los endpoints
- [ ] Usuario solo accede a sus datos (where: { userId })
- [ ] Input validado con DTOs/schemas
- [ ] No hay SQL crudo
- [ ] Funciones Pro protegidas por guard de suscripción
- [ ] No se exponen datos sensibles en responses
```

### 5. Revisión UX
```
- [ ] Estados vacíos implementados
- [ ] Loading states
- [ ] Error states
- [ ] Mensajes claros
- [ ] Sin lenguaje médico/terapéutico/diagnóstico
- [ ] Disclaimers presentes donde corresponde
- [ ] Baja fricción (mínimas opciones cuando corresponde)
```

### 6. Revisión de Restricciones por Plan
```
- [ ] Features Free tienen límites implementados
- [ ] Features Pro validan suscripción activa
- [ ] Paywall amable (no agresivo)
- [ ] Mensaje de límite validador (no frustrante)
```

### 7. Revisión MVP
```
- [ ] No hay features fuera del MVP
- [ ] No hay over-engineering
- [ ] Microacciones vienen de DB, no hardcoded
```

### 8. Emitir Resultado
```markdown
Estado: [Aprobado / No Aprobado]

Errores Críticos: [lista o "Ninguno"]
Errores Medios: [lista o "Ninguno"]
Mejoras Opcionales: [lista o "Ninguna"]

Criterios Cumplidos: X/Y
Criterios Pendientes: [lista]

Recomendación: [Aprobar / Corregir y re-validar / Devolver a Specs]
```

### 9. Routing de Resultado
```
Si Aprobado → Orquestador cierra módulo
Si Rechazado por código → Implementación corrige
Si Rechazado por spec → Specs actualiza definición
```

## Regla
El Validador SIEMPRE responde con el formato obligatorio. Sin formato → validación inválida.
