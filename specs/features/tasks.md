# Feature: Tareas — NeuroDaily

## Descripción
Sistema de gestión de tareas con carga cognitiva. Detecta tareas vagas y sugiere Modo Primer Paso.

## User Stories
- Como usuario, quiero crear tareas categorizadas para organizar mi día.
- Como usuario, quiero indicar la carga cognitiva de cada tarea para que la app me recomiende el momento adecuado.
- Como usuario, quiero que la app detecte cuando una tarea es vaga y me sugiera descomponerla.

## Modelo de Datos

```sql
tasks
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  title             VARCHAR(255) NOT NULL
  description       TEXT NULLABLE
  category          VARCHAR NOT NULL
  cognitive_load    VARCHAR NOT NULL -- low, medium, high
  estimated_minutes INT NULLABLE
  due_date          TIMESTAMP NULLABLE
  status            VARCHAR NOT NULL DEFAULT 'pending' -- pending, in_progress, completed, postponed
  created_at        TIMESTAMP
  updated_at        TIMESTAMP
```

**Nota:** `emotional_weight`, `clarity_level` y `next_step` removidos del MVP. `clarity_level` se detecta algorítmicamente. `next_step` vive en `first_step_logs`.

## Categorías

| Categoría | Clave | Plan |
|---|---|---|
| Trabajo | work | Free |
| Estudio | study | Free |
| Personal | personal | Free |
| Bienestar | wellness | Pro |
| Hobby | hobby | Pro |
| Administración | admin | Pro |
| Social | social | Pro |

Free: 3 categorías (work, study, personal).
Pro: todas (7).

## Detección de Tareas Vagas

Algoritmo: una tarea es "vaga" si:
1. `title` tiene ≤ 4 palabras Y no contiene verbos de acción específicos
2. Ejemplos: "hacer tesis", "crear landing", "estudiar IA", "ordenar mi vida"

Cuando se detecta tarea vaga:
```
"Esta tarea parece amplia. ¿Quieres que te ayude con el primer paso?"
[Sí, ayúdame] [No, así está bien]
```

## Endpoints

### POST /tasks
- **Auth:** Requerida
- **Validación Free:** Máx 5 tareas activas (status != completed). Si excede → 403 + "Has alcanzado tus 5 tareas activas. Completa alguna o desbloquea más con Pro."
- **Body:** `{ title, description?, category, cognitive_load, estimated_minutes?, due_date? }`
- **Response:** `{ id, ...fields, is_vague: boolean }`

### GET /tasks
- **Auth:** Requerida
- **Query:** `?status=pending&category=work`
- **Response:** Array de tareas del usuario

### GET /tasks/:id
- **Auth:** Requerida + ownership check
- **Response:** Tarea con detalles

### PATCH /tasks/:id
- **Auth:** Requerida + ownership check
- **Body:** Campos a actualizar
- **Response:** Tarea actualizada

### DELETE /tasks/:id
- **Auth:** Requerida + ownership check
- **Response:** `{ deleted: true }`

## Pantallas
- **Lista de tareas:** Agrupadas por categoría o por estado. Cards con chip de carga cognitiva (verde/amarillo/rojo).
- **Crear tarea:** Form con campos. Autodetección de vaguedad al escribir título.
- **Editar tarea:** Mismo form con datos precargados.
- **Estado vacío:** "Sin tareas todavía. Crea tu primera tarea para empezar."
- **Estado límite Free:** "5/5 tareas activas. Completa alguna o desbloquea más. 🌿"

## Reglas de Negocio
- Tareas completadas no cuentan para el límite Free
- Tareas postponed SÍ cuentan para el límite
- Categorías Pro bloqueadas en Free con badge
- Al completar tarea → animación sutil de logro
- Streak: contar días consecutivos completando ≥1 tarea

## Restricciones por Plan
- Free: 5 tareas activas, 3 categorías
- Pro: ilimitadas, todas las categorías

## Edge Cases
- Usuario intenta crear tarea #6 en Free → paywall amable
- Usuario completa tarea y vuelve a tener <5 → puede crear nueva
- Tarea sin due_date → no aparece en vista de "vencimiento"
- Tarea con estimated_minutes = null → motor de recomendación usa 30min default

## Criterios de Aceptación
- [ ] CRUD completo de tareas
- [ ] Límite de 5 tareas activas en Free
- [ ] Chip visual de carga cognitiva (low=verde, medium=amarillo, high=rojo)
- [ ] Detección automática de tareas vagas
- [ ] Sugerencia de Primer Paso para tareas vagas
- [ ] Categorías Pro bloqueadas en Free
- [ ] Ownership check en todos los endpoints
- [ ] Estado vacío implementado
- [ ] Animación al completar tarea

## Dependencias
- Sprint 1 (auth, modelo usuario)
