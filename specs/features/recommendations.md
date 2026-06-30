# Feature: Motor de Recomendación — NeuroDaily

## Descripción
Sistema basado en reglas que decide qué recomendar al usuario. Alimentado por check-in, tareas, preferencias y contexto. No usa IA compleja en MVP — funciona aunque OpenAI falle.

## User Stories
- Como usuario, quiero presionar "¿Qué hago ahora?" y recibir UNA recomendación clara con razón.
- Como usuario, quiero una alternativa si la recomendación principal no me convence.
- Como usuario, quiero entender POR QUÉ se me recomienda algo.

## Botón Core: "¿Qué hago ahora?"

### Input
Datos del check-in más reciente + tareas activas + preferencias + hora actual.

### Output
```json
{
  "type": "micro_action | task | first_step | rest",
  "primary": {
    "id": "uuid",
    "title": "Respiración 4-6",
    "reason": "Porque marcaste ansiedad alta, estás en oficina y tienes poco tiempo.",
    "duration": "2 min",
    "action": "start"
  },
  "alternative": {
    "id": "uuid",
    "title": "Pausa visual 20-20-20",
    "reason": "Si prefieres algo sin respiración controlada.",
    "duration": "1 min",
    "action": "start"
  },
  "manual_option": true
}
```

## Reglas del Motor (Prioridad descendente)

### R1: Ansiedad Alta + Poco Tiempo + Oficina
```
IF anxiety >= 4 AND available_time <= 5 AND context = "office"
THEN recommend breathing (discrete) — suspiro fisiológico o 4-6
```

### R2: Ansiedad Alta + Cualquier Contexto
```
IF anxiety >= 4
THEN recommend anxiety_calm — grounding 5-4-3-2-1 o descarga mental
```

### R3: Energía Baja + Ansiedad Baja
```
IF energy <= 2 AND anxiety <= 2
THEN recommend physical_rest — caminata, pausa visual, tomar agua
```

### R4: Tarea Alta Carga + Bloqueado
```
IF next_task.cognitive_load = "high" AND (no progress OR user reports blocked)
THEN recommend first_step mode
```

### R5: Post Pantalla Intensa
```
IF last_session.type = "screen_work" AND duration > 45min
THEN recommend visual_rest — 20-20-20, cuello, muñecas
```

### R6: Rechazo Repetido
```
IF user rejected same category >= 2 times today
THEN deprioritize that category, offer different
```

### R7: Sueño Bajo
```
IF sleep_quality <= 2
THEN avoid high cognitive_load tasks first, prefer low/medium
```

### R8: Claridad Mental Baja
```
IF mental_clarity <= 2
THEN recommend first_step (microscopic level) or task decomposition
```

### R9: Contexto Transporte
```
IF context = "transport"
THEN only discrete micro_actions (no movement, no standing)
```

### R10: Contexto Oficina
```
IF context = "office"
THEN prioritize discrete actions. Flag non-discrete.
```

### R11: Contexto Casa
```
IF context = "home"
THEN allow full range — movement, walking, stretching
```

### R12: Default — Siguiente Tarea
```
IF no special conditions
THEN recommend next task by priority: due_date > cognitive_load match > category
```

## Modo "No Quiero Pensar, Ayúdame"
1. Tomar check-in más reciente (o pedir mínimo inline)
2. Elegir UNA sola acción — no mostrar opciones
3. Iniciarla directamente con botón "Empezar"
4. Al terminar → sugerir UNA tarea mínima
5. Free: 1 uso/día. Pro: ilimitado.

## Modelo de Datos

```sql
recommendation_logs
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  input_context     JSONB -- snapshot del check-in + preferencias usadas
  recommended_type  VARCHAR -- micro_action, task, first_step, rest
  recommended_id    UUID NULLABLE
  reason            TEXT
  accepted          BOOLEAN NULLABLE
  created_at        TIMESTAMP
```

## Endpoints

### POST /recommendations
- **Auth:** Requerida
- **Body:** `{ type: "now" | "day-plan" }`
- **Validación Free:** "now" máx 3/día. "day-plan" solo Pro.
- **Response:** Objeto con primary + alternative + reason
- **Efecto:** Crea `recommendation_log`

## Pantalla "¿Qué hago ahora?"
```
┌────────────────────────────────┐
│  Tu mejor acción ahora:       │
│                                │
│  🫁 Respiración 4-6 — 2 min   │
│  Porque marcaste ansiedad     │
│  alta, estás en oficina y     │
│  tienes poco tiempo.          │
│                                │
│  [Empezar]                    │
│                                │
│  ¿Prefieres otra cosa?        │
│  👁 Pausa visual 20-20-20     │
│  [Cambiar a esta]             │
│                                │
│  [Elegir manualmente]         │
└────────────────────────────────┘
```

## Restricciones por Plan
- Free: 3 usos "¿Qué hago ahora?"/día, sin day-plan
- Pro: ilimitado + day-plan

## Edge Cases
- No hay check-in → pedir check-in mínimo inline (3 campos)
- No hay tareas → recomendar microacción basada en estado
- Todas las microacciones rechazadas → ofrecer "elegir manualmente"
- Motor falla → fallback a microacción genérica (respiración simple)

## Criterios de Aceptación
- [ ] Botón "¿Qué hago ahora?" funcional
- [ ] Devuelve 1 recomendación principal + 1 alternativa
- [ ] Cada recomendación incluye razón breve
- [ ] Reglas del motor implementadas y priorizadas
- [ ] Free limitado a 3/día con mensaje amable
- [ ] Logs de recomendación en DB
- [ ] Modo "No quiero pensar" funcional
- [ ] Fallback si no hay check-in

## Dependencias
- Sprint 2 (check-in, tareas)
- Sprint 3 (microacciones)
