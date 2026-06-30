# Feature: Suscripciones — NeuroDaily

## Descripción
Sistema de suscripción SaaS con Stripe. Dos planes: Free y Pro. Conversión diseñada con principios de psicología conductual.

## User Stories
- Como usuario Free, quiero ver qué features me estoy perdiendo para evaluar si me conviene Pro.
- Como usuario, quiero poder suscribirme a Pro de forma simple con Stripe.
- Como usuario Pro, quiero gestionar mi suscripción sin contactar soporte.

## Planes

### Free ($0)
| Límite | Valor |
|---|---|
| Tareas activas | 5 |
| Check-ins | 1/día |
| "¿Qué hago ahora?" | 3/día |
| Modo Primer Paso | 3/día |
| "Dame algo más fácil" | 1 nivel |
| Microacciones | breathing + 2 random |
| "No quiero pensar" | 1/día |
| Historial | 7 días |
| Categorías de tarea | 3 (work, study, personal) |
| IA | ❌ |
| Estadísticas | ❌ |
| Patrones | ❌ |
| Exportar datos | ❌ |

### Pro
| Precio | Valor |
|---|---|
| Mensual | $7.99 - $9.99/mes |
| Anual | $59.99/año (~$5/mes) |

Todo ilimitado + IA + estadísticas + patrones + personalización avanzada + exportar datos.

## Modelo de Datos

```sql
subscriptions
  id                      UUID PRIMARY KEY
  user_id                 UUID REFERENCES users(id) UNIQUE
  stripe_customer_id      VARCHAR UNIQUE
  stripe_subscription_id  VARCHAR NULLABLE UNIQUE
  plan                    VARCHAR NOT NULL DEFAULT 'free' -- free, pro
  status                  VARCHAR NOT NULL DEFAULT 'active' -- active, canceled, past_due, trialing
  current_period_end      TIMESTAMP NULLABLE
  cancel_at_period_end    BOOLEAN DEFAULT false
  created_at              TIMESTAMP
  updated_at              TIMESTAMP
```

## Stripe Integration

### Checkout Flow
1. Usuario hace clic en "Obtener Pro"
2. Backend crea Stripe Checkout Session
3. Redirect a Stripe
4. Stripe webhook confirma pago
5. Backend actualiza suscripción a `plan: pro, status: active`
6. Frontend refleja acceso Pro

### Customer Portal
- Gestionar método de pago
- Cancelar suscripción
- Ver facturas
- Cambiar de plan (mensual ↔ anual)

### Webhooks a Manejar
| Evento | Acción |
|---|---|
| `checkout.session.completed` | Crear/actualizar suscripción Pro |
| `invoice.paid` | Renovar período |
| `invoice.payment_failed` | Marcar `past_due` |
| `customer.subscription.deleted` | Revertir a Free |
| `customer.subscription.updated` | Actualizar período/estado |

## Endpoints

### POST /billing/create-checkout-session
- **Auth:** Requerida
- **Body:** `{ plan: "pro_monthly" | "pro_annual" }`
- **Response:** `{ url: "https://checkout.stripe.com/..." }`

### POST /billing/customer-portal
- **Auth:** Requerida
- **Response:** `{ url: "https://billing.stripe.com/..." }`

### POST /webhooks/stripe
- **Auth:** Stripe signature verification
- **Body:** Stripe event
- **Response:** 200

## Guard/Middleware de Plan

```typescript
// PlanGuard — se aplica a endpoints Pro
@UseGuards(PlanGuard('pro'))
@Get('recommendations/day-plan')
getDayPlan() { ... }
```

El guard verifica:
1. Usuario tiene suscripción
2. `plan === 'pro'`
3. `status === 'active'` o `status === 'trialing'`
4. `current_period_end > now()`

Si no cumple → 403 con payload:
```json
{
  "error": "pro_required",
  "message": "Esta función está disponible en el plan Pro.",
  "upgrade_url": "/pricing"
}
```

## Contadores de Uso (Free Limits)

```sql
usage_counters
  id              UUID PRIMARY KEY
  user_id         UUID REFERENCES users(id)
  counter_type    VARCHAR NOT NULL -- recommendations, first_steps, no_think, checkins
  counter_date    DATE NOT NULL
  count           INT DEFAULT 0
  UNIQUE(user_id, counter_type, counter_date)
```

Cada uso incrementa el contador. El middleware verifica antes de procesar.

## UX de Paywall

### Principio: Validar, no frustrar (Regla Pico-Final)

**Mensaje cuando alcanza límite:**
```
"3 recomendaciones usadas hoy. Completaste 2 tareas. Buen día. 🌿
Mañana tienes 3 más, o desbloquéalas ahora."

[Ver Pro]  [Mañana sigo con Free]
```

### Principio: No mostrar paywall antes del primer ciclo exitoso
- Primera sesión del usuario → SIN paywalls
- Después de completar: onboarding → check-in → 1 recomendación → 1 acción → feedback
- ENTONCES activar contadores

## Pantallas

### Pricing Page (Pública)
- 2 columnas: Free vs Pro
- Features comparadas con checks/crosses
- CTA "Empezar Gratis" y "Obtener Pro"
- Badge "Más popular" en anual
- Descuento visible: "Ahorra 40% con el plan anual"

### Gestión de Suscripción (Autenticada)
- Plan actual
- Fecha de renovación
- Botón "Gestionar en Stripe" (portal)
- Si Free: botón "Mejorar a Pro"

## Edge Cases
- Stripe webhook falla → reintentar (Stripe reintenta automáticamente)
- Usuario cancela → acceso Pro hasta fin del período
- Tarjeta rechazada → `past_due` → 3 días gracia → revert a Free
- Usuario elimina cuenta → cancelar suscripción en Stripe

## Criterios de Aceptación
- [ ] Checkout flow con Stripe funcional
- [ ] Customer Portal accesible
- [ ] Webhooks manejan todos los eventos listados
- [ ] Guard/middleware bloquea features Pro para Free
- [ ] Contadores de uso diario funcionan correctamente
- [ ] Paywall amable, no agresivo
- [ ] Sin paywall en primera sesión del usuario
- [ ] Pricing page con comparación clara
- [ ] Cancelación mantiene acceso hasta fin de período
- [ ] Usage counters se resetean diariamente

## Dependencias
- Sprint 1 (auth, modelo usuario)
- Stripe account configurada
