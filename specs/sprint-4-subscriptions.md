# Especificaciones — Sprint 4: Suscripciones y Pagos (Stripe)

## User Stories
- Como usuario, quiero ver una página de planes donde se comparen los beneficios del plan Free vs Pro.
- Como usuario, quiero poder suscribirme al plan Pro usando mi tarjeta de crédito mediante Stripe Checkout.
- Como usuario Pro, quiero tener acceso a funciones premium (microacciones bloqueadas, Modo Primer Paso inteligente con IA).
- Como usuario, quiero poder acceder a un portal (Stripe Customer Portal) para cancelar o gestionar mi suscripción.

## Reglas de Negocio
1. **Plan Free:**
   - Acceso a tareas ilimitadas.
   - Acceso a check-ins.
   - Acceso a microacciones marcadas como `isPremium: false`.
   - Motor "Primer Paso" funciona con modo "Fallback Seguro" (plantillas predefinidas sin OpenAI).
2. **Plan Pro ($5/mes - suscripción recurrente):**
   - Acceso a TODAS las microacciones.
   - Modo "Primer Paso" impulsado por OpenAI (sugerencias dinámicas y contextuales).
3. **Manejo de Webhooks:**
   - La aplicación debe escuchar eventos de Stripe (`checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`).
   - Al recibir pago exitoso, actualizar la base de datos y la metadata de Clerk (`stripeCustomerId`, `plan: 'pro'`).
4. **Protección de Rutas (AuthGuard):**
   - Los endpoints premium deben validar en el servidor que el usuario tenga `plan: 'pro'` en su metadata.
   - En el frontend, mostrar *upselling* (bloqueos visuales 🔒) para acciones Pro.

## Endpoints (Backend - NestJS)
- `GET /subscriptions/current` -> Obtiene estado actual de suscripción de la DB.
- `POST /subscriptions/checkout` -> Crea sesión de Stripe Checkout y devuelve la URL.
- `POST /subscriptions/portal` -> Crea sesión de Stripe Customer Portal para gestionar la suscripción.
- `POST /webhooks/stripe` -> Endpoint público (raw body) para escuchar eventos de Stripe y actualizar la DB (Prisma) y Clerk.

## Pantallas (Frontend - Next.js)
- `app/(dashboard)/settings/billing/page.tsx` -> Mostrar estado actual, botón de Upgrade a Pro o "Gestionar Suscripción".
- Modal o visualización premium en microacciones (mostrar botón "Desbloquear Pro").

## Criterios de Aceptación
1. Si un usuario Free intenta hacer POST al endpoint con OpenAI, la API debe devolver 403 Forbidden o procesarlo como fallback, no cobrar el token.
2. El Webhook debe ser seguro y verificar la firma de Stripe (`stripe.webhooks.constructEvent`).
3. Al cancelar desde Stripe, la DB debe volver a `plan: free` automáticamente.
