# API Endpoints — NeuroDaily MVP

## Base URL
`/api/v1`

## Auth
Todos los endpoints (excepto webhooks y públicos) requieren auth via Clerk JWT.

---

## User / Auth

| Method | Path | Auth | Plan | Descripción |
|---|---|---|---|---|
| GET | /me | ✅ | All | Perfil del usuario + preferencias |
| PATCH | /me/preferences | ✅ | All | Actualizar preferencias |

## Onboarding

| Method | Path | Auth | Plan | Descripción |
|---|---|---|---|---|
| POST | /onboarding | ✅ | All | Completar onboarding |
| GET | /onboarding/status | ✅ | All | Estado del onboarding |

## Check-ins

| Method | Path | Auth | Plan | Descripción |
|---|---|---|---|---|
| POST | /checkins | ✅ | Free: 1/día, Pro: ilimitado | Crear check-in |
| GET | /checkins/today | ✅ | All | Check-in de hoy |
| GET | /checkins/history | ✅ | Free: 7 días, Pro: 90 días | Historial |

## Tasks

| Method | Path | Auth | Plan | Descripción |
|---|---|---|---|---|
| POST | /tasks | ✅ | Free: máx 5 activas | Crear tarea |
| GET | /tasks | ✅ | All | Listar tareas |
| GET | /tasks/:id | ✅ | All | Detalle tarea |
| PATCH | /tasks/:id | ✅ | All | Actualizar tarea |
| DELETE | /tasks/:id | ✅ | All | Eliminar tarea |

## First Step

| Method | Path | Auth | Plan | Descripción |
|---|---|---|---|---|
| POST | /first-step/generate | ✅ | Free: 3/día + 1 easier. Pro: ilimitado | Generar primer paso |

**Body:**
```json
{
  "task_id": "uuid (optional)",
  "free_text": "string (optional)",
  "action": "initial | easier | next"
}
```

## Micro Actions

| Method | Path | Auth | Plan | Descripción |
|---|---|---|---|---|
| GET | /micro-actions | ✅ | Free: filtered | Listar microacciones |
| GET | /micro-actions/recommended | ✅ | All | Recomendación basada en check-in |
| GET | /micro-actions/:id | ✅ | Premium: Pro only | Detalle microacción |
| POST | /micro-actions/:id/start | ✅ | All | Iniciar sesión |
| POST | /micro-actions/:id/feedback | ✅ | All | Enviar feedback |

## Recommendations

| Method | Path | Auth | Plan | Descripción |
|---|---|---|---|---|
| POST | /recommendations | ✅ | Free: 3/día "now", Pro: ilimitado + "day-plan" | Obtener recomendación |

**Body:**
```json
{
  "type": "now | day-plan"
}
```

## Billing

| Method | Path | Auth | Plan | Descripción |
|---|---|---|---|---|
| POST | /billing/create-checkout-session | ✅ | All | Crear sesión Stripe |
| POST | /billing/customer-portal | ✅ | All | Portal de cliente |
| POST | /webhooks/stripe | ❌ (Stripe sig) | — | Webhook |

## Admin

| Method | Path | Auth | Plan | Descripción |
|---|---|---|---|---|
| GET | /admin/micro-actions | Admin | — | Listar todas |
| POST | /admin/micro-actions | Admin | — | Crear |
| PATCH | /admin/micro-actions/:id | Admin | — | Editar |
| DELETE | /admin/micro-actions/:id | Admin | — | Soft delete |
| GET | /admin/feedback | Admin | — | Ver feedback |
| GET | /admin/recommendation-logs | Admin | — | Ver logs |

---

## Resumen de Conteo

| Grupo | Endpoints |
|---|---|
| User/Auth | 2 |
| Onboarding | 2 |
| Check-ins | 3 |
| Tasks | 5 |
| First Step | 1 |
| Micro Actions | 5 |
| Recommendations | 1 |
| Billing | 3 |
| Admin | 6 |
| **Total** | **28** |

## Error Responses Standard

```json
{
  "statusCode": 400,
  "error": "validation_error",
  "message": "Campo 'title' es requerido."
}

{
  "statusCode": 403,
  "error": "plan_limit_reached",
  "message": "Has usado tus 3 recomendaciones de hoy. 🌿",
  "upgrade_url": "/pricing"
}

{
  "statusCode": 403,
  "error": "pro_required",
  "message": "Esta función está disponible en el plan Pro.",
  "upgrade_url": "/pricing"
}

{
  "statusCode": 404,
  "error": "not_found",
  "message": "Recurso no encontrado."
}
```
