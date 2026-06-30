# Feature: Check-in Diario — NeuroDaily

## Descripción
Registro diario del estado del usuario. Alimenta el motor de recomendación. 3 niveles para reducir fricción.

## User Stories
- Como usuario, quiero registrar mi estado rápidamente (5 seg) para recibir recomendaciones relevantes.
- Como usuario Pro, quiero hacer check-ins más detallados para recomendaciones más precisas.
- Como usuario, quiero poder re-hacer mi check-in si mi estado cambia durante el día (Pro).

## Niveles de Check-in

### Nivel 1: Rápido (Default Free/Pro) — 5 segundos
| Campo | Tipo | Opciones |
|---|---|---|
| energy_level | slider 1-5 | muy baja → muy alta |
| anxiety_level | slider 1-5 | nula → muy alta |
| current_context | select | home, office, university, transport |

### Nivel 2: Normal (Opcional) — 15 segundos
Incluye Nivel 1 +
| Campo | Tipo | Opciones |
|---|---|---|
| sleep_quality | slider 1-5 | muy mala → excelente |
| available_time | select | 5min, 15min, 30min, 60min, 120min+ |
| can_move | boolean | ¿Puedes levantarte/moverte? |

### Nivel 3: Detallado (Solo Pro) — 30 segundos
Incluye Nivel 1 + 2 +
| Campo | Tipo | Opciones |
|---|---|---|
| mental_clarity | slider 1-5 | muy baja → muy alta |
| current_state | select | focused, tired, anxious, overwhelmed, distracted, energetic |

## Modelo de Datos

```sql
daily_checkins
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES users(id)
  energy_level    INT (1-5)
  anxiety_level   INT (1-5)
  current_context VARCHAR
  sleep_quality   INT (1-5) NULLABLE
  available_time  INT NULLABLE (minutes)
  can_move        BOOLEAN NULLABLE
  mental_clarity  INT (1-5) NULLABLE
  current_state   VARCHAR NULLABLE
  checkin_level   INT (1, 2, or 3)
  created_at      TIMESTAMP
```

## Endpoints

### POST /checkins
- **Auth:** Requerida
- **Body:** Campos según nivel
- **Validación Free:** Máx 1/día. Si ya existe hoy → 403 con mensaje "Tu check-in de hoy ya está registrado. Con Pro puedes actualizarlo."
- **Validación Pro:** Sin límite diario
- **Response:** `{ id, ...fields, created_at }`

### GET /checkins/today
- **Auth:** Requerida
- **Response:** Check-in de hoy o `null`

### GET /checkins/history
- **Auth:** Requerida
- **Query:** `?days=7` (Free: máx 7, Pro: máx 90)
- **Response:** Array de check-ins

## Pantallas
- **Check-in rápido:** 3 sliders/selects en una sola pantalla. Botón "Listo" y "Quiero ser más específico".
- **Check-in normal:** Se expanden campos adicionales con animación
- **Check-in detallado:** Se expanden campos Pro con badge "Pro"
- **Estado vacío:** "¿Cómo estás hoy? Un check-in rápido de 5 segundos."

## Reglas de Negocio
- El check-in rápido es el default. Nunca forzar el detallado.
- Los campos NULL del nivel rápido se asumen como "promedio" (3/5) para el motor de recomendación.
- El motor de recomendación funciona con solo los 3 campos del nivel rápido.

## Restricciones por Plan
- Free: 1 check-in/día, solo niveles 1-2
- Pro: ilimitados, todos los niveles

## Edge Cases
- Usuario no hace check-in → el botón "¿Qué hago ahora?" pregunta estado mínimo inline
- Usuario hace check-in a las 11pm → cuenta para ese día, no el siguiente
- Timezone → usar timezone del usuario para determinar "hoy"

## Criterios de Aceptación
- [ ] Check-in rápido completable en ≤5 segundos
- [ ] Campos opcionales expandibles con animación
- [ ] Free limitado a 1/día con mensaje amable
- [ ] Pro puede re-hacer check-in
- [ ] Nivel 3 bloqueado para Free con badge Pro
- [ ] Historial respeta límites por plan (7 vs 90 días)
- [ ] Check-in alimenta correctamente el motor de recomendación
- [ ] Campos NULL se asumen como valor medio

## Dependencias
- Sprint 1 (auth, modelo usuario)
- Onboarding (para contexto default)
