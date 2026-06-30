# Feature: Microacciones Guiadas — NeuroDaily

## Descripción
Biblioteca editable de actividades breves de baja fricción. Viven en DB, administrables desde panel admin. Incluyen temporizador e instrucciones paso a paso.

## User Stories
- Como usuario, quiero recibir microacciones con instrucciones concretas para saber exactamente qué hacer.
- Como usuario, quiero un temporizador durante la microacción para saber cuándo terminar.
- Como usuario, quiero dejar feedback sobre una microacción para que el sistema aprenda.
- Como admin, quiero crear/editar microacciones sin tocar código.

## Modelo de Datos

```sql
micro_actions
  id                    UUID PRIMARY KEY
  title                 VARCHAR(255) NOT NULL
  slug                  VARCHAR(255) UNIQUE NOT NULL
  category              VARCHAR NOT NULL
  goal                  VARCHAR NOT NULL
  description           TEXT
  duration_seconds      INT NOT NULL
  difficulty            VARCHAR NOT NULL -- easy, medium, hard
  energy_required       VARCHAR NOT NULL -- low, medium, high
  recommended_contexts  JSONB -- ["office", "home", "transport"]
  anxiety_levels        JSONB -- ["low", "medium", "high"]
  cognitive_load_match  VARCHAR -- low, medium, high
  instructions          JSONB -- ["Paso 1...", "Paso 2..."]
  contraindications     JSONB -- ["No fuerces...", "Detente si..."]
  is_active             BOOLEAN DEFAULT true
  is_premium            BOOLEAN DEFAULT false
  created_by_admin      BOOLEAN DEFAULT true
  sort_order            INT DEFAULT 0
  created_at            TIMESTAMP
  updated_at            TIMESTAMP

user_micro_action_feedback
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  micro_action_id   UUID REFERENCES micro_actions(id)
  rating            INT (1-5)
  feedback          TEXT NULLABLE
  created_at        TIMESTAMP

focus_sessions
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  task_id           UUID NULLABLE REFERENCES tasks(id)
  micro_action_id   UUID NULLABLE REFERENCES micro_actions(id)
  started_at        TIMESTAMP NOT NULL
  ended_at          TIMESTAMP NULLABLE
  completed         BOOLEAN DEFAULT false
  mood_after        INT (1-5) NULLABLE
  created_at        TIMESTAMP
```

## Categorías Iniciales

| Categoría | Clave | Ejemplos |
|---|---|---|
| Respiración | breathing | Box breathing, Suspiro fisiológico, 4-6, 4-7-8 |
| Ansiedad/Calma | anxiety_calm | Grounding 5-4-3-2-1, descarga mental, relajar mandíbula |
| Descanso físico | physical_rest | Estiramiento cuello, hombros, pausa 20-20-20 |
| Pausa visual | visual_rest | 20-20-20, mirar lejos, cerrar ojos |
| Estudio | study | Active recall, explicar en voz alta, mini quiz |
| Trabajo/Enfoque | work_focus | Primer paso 2min, cerrar pestañas, definir "terminado" |
| Hobbies | hobbies | Dibujo libre, escuchar canción, leer 1 página |
| Cierre del día | day_closure | Revisar logros, planear mañana, gratitud |

## Plan Free: Acceso a Microacciones
- **Categoría `breathing`:** Siempre disponible
- **2 microacciones aleatorias** de otras categorías: rotan diariamente
- **Resto:** Bloqueado con badge Pro

## Endpoints

### GET /micro-actions
- **Auth:** Requerida
- **Query:** `?category=breathing&context=office`
- **Response:** Array filtrado. Free: solo las accesibles.

### GET /micro-actions/recommended
- **Auth:** Requerida
- **Response:** 1 recomendación principal + 1 alternativa basada en check-in actual.

### GET /micro-actions/:id
- **Auth:** Requerida
- **Validación:** Si `is_premium` y usuario Free → 403 con paywall amable

### POST /micro-actions/:id/start
- **Auth:** Requerida
- **Body:** `{ task_id?: string }` (si está vinculada a una tarea)
- **Response:** `{ session_id, micro_action, started_at }`
- **Efecto:** Crea `focus_session`

### POST /micro-actions/:id/feedback
- **Auth:** Requerida
- **Body:** `{ session_id, rating: 1-5, feedback?: string, mood_after?: 1-5, completed: boolean }`
- **Response:** `{ saved: true }`
- **Efecto:** Actualiza `focus_session` + crea `user_micro_action_feedback`

## Pantallas

### Microacción Guiada
```
┌────────────────────────────────┐
│  Box Breathing                 │
│  Categoría: Respiración        │
│  Duración: 2 minutos           │
│                                │
│  ⏱ 1:45                       │
│                                │
│  Paso actual:                  │
│  "Inhala durante 4 segundos"   │
│                                │
│  ⚠️ No fuerces la respiración.│
│  Detente si aparece mareo.     │
│                                │
│  [Pausar]  [Terminar antes]    │
└────────────────────────────────┘
```

### Feedback Post-Microacción
```
┌────────────────────────────────┐
│  ¿Cómo te fue?                │
│                                │
│  ⭐⭐⭐⭐⭐  (rating)          │
│                                │
│  ¿Cómo te sientes ahora?      │
│  😫 😕 😐 🙂 😊               │
│                                │
│  Comentario (opcional):        │
│  [___________________________] │
│                                │
│  [Enviar]  [Omitir]           │
└────────────────────────────────┘
```

## Temporizador
- Cuenta regresiva visual
- Instrucciones avanzan automáticamente según timing (o manual)
- Sonido sutil al terminar (configurable)
- Vibración en móvil (si disponible)

## Contraindications — Reglas
- Siempre visibles ANTES de iniciar la microacción
- Respiraciones: "No fuerces. Detente ante mareo o incomodidad."
- Respiraciones avanzadas: NO incluidas en MVP
- Estiramientos: "Movimientos suaves. No fuerces."
- Movimiento: "Solo si puedes levantarte de forma segura."

## Edge Cases
- Usuario cierra browser durante microacción → session queda incompleta (completed=false)
- Timer llega a 0 → mostrar pantalla de feedback automáticamente
- Usuario termina antes → registrar tiempo real, no el estimado
- Feedback de 1-2 estrellas → reducir prioridad de esa microacción para ese usuario

## Criterios de Aceptación
- [ ] Microacciones se cargan desde DB, no hardcoded
- [ ] Temporizador funcional con cuenta regresiva
- [ ] Instrucciones paso a paso visibles durante la microacción
- [ ] Contraindications visibles antes de iniciar
- [ ] Feedback post-microacción con rating y mood
- [ ] Free: solo breathing + 2 random
- [ ] Pro: acceso completo
- [ ] Focus session registrada en DB
- [ ] Admin puede crear/editar/desactivar desde panel

## Dependencias
- Sprint 1 (auth, DB)
- Sprint 2 (tareas para vinculación opcional)
