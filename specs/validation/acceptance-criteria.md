# Criterios de Aceptación Generales — NeuroDaily MVP

## Auth & Usuarios
- [ ] El usuario puede registrarse con Clerk
- [ ] El usuario puede iniciar sesión
- [ ] Los endpoints están protegidos por auth
- [ ] Un usuario NO puede acceder a datos de otro usuario
- [ ] Existe rol admin diferenciado

## Onboarding
- [ ] El usuario puede completar todos los pasos
- [ ] Las preferencias se guardan como JSONB en `users`
- [ ] No se puede acceder al dashboard sin onboarding
- [ ] Se puede re-hacer desde configuración

## Check-in
- [ ] Check-in rápido (3 campos) completable en ≤5 segundos
- [ ] Free: 1/día. Pro: ilimitados
- [ ] Nivel 3 bloqueado para Free
- [ ] Campos NULL se asumen como valor medio para el motor

## Tareas
- [ ] CRUD completo
- [ ] Free: máx 5 tareas activas
- [ ] Chip visual de carga cognitiva
- [ ] Detección automática de tareas vagas
- [ ] Categorías Pro bloqueadas en Free
- [ ] Ownership check en todos los endpoints

## Modo Primer Paso
- [ ] Genera paso concreto, ejecutable en <2min
- [ ] 4 niveles de dificultad
- [ ] Free: 3/día + 1 easier. Pro: ilimitado
- [ ] Fallback a reglas si IA falla
- [ ] Log registrado en DB

## Microacciones
- [ ] Cargadas desde DB, no hardcoded
- [ ] Temporizador funcional
- [ ] Instrucciones paso a paso
- [ ] Contraindications visibles antes de iniciar
- [ ] Free: breathing + 2 random. Pro: todas
- [ ] Feedback con rating y mood

## Motor de Recomendación
- [ ] Botón "¿Qué hago ahora?" funcional
- [ ] 1 recomendación principal + 1 alternativa
- [ ] Razón breve incluida
- [ ] Free: 3/día. Pro: ilimitado
- [ ] Reglas priorizadas implementadas
- [ ] Fallback si no hay check-in
- [ ] Logs en DB

## "No Quiero Pensar"
- [ ] 1 acción directa sin opciones
- [ ] Free: 1/día. Pro: ilimitado
- [ ] Post-acción sugiere tarea mínima

## Streaks
- [ ] Contador visible en dashboard
- [ ] Se incrementa con ≥1 tarea completada o ≥1 check-in por día
- [ ] Se resetea si pierde un día

## Suscripciones
- [ ] Stripe Checkout funcional
- [ ] Customer Portal accesible
- [ ] Webhooks manejan eventos correctamente
- [ ] Guard bloquea features Pro para Free
- [ ] Contadores de uso se resetean diariamente
- [ ] Paywall amable, no agresivo
- [ ] Sin paywall en primera sesión

## Admin
- [ ] Solo admins acceden
- [ ] CRUD de microacciones sin tocar código
- [ ] Soft delete
- [ ] Feedback anonimizado visible
- [ ] Logs de recomendaciones visibles

## Seguridad & Disclaimers
- [ ] No lenguaje médico/terapéutico/diagnóstico
- [ ] Disclaimer en landing y microacciones
- [ ] Contraindications en respiraciones
- [ ] Input validado en frontend Y backend
- [ ] No SQL crudo (solo Prisma)
- [ ] Endpoints protegidos por usuario

## UX
- [ ] Estados vacíos diseñados en todas las pantallas
- [ ] Loading states
- [ ] Error states con mensajes claros
- [ ] Máximo 3 opciones en recomendaciones
- [ ] Animaciones suaves (Framer Motion)
- [ ] Responsive (desktop + mobile web)
