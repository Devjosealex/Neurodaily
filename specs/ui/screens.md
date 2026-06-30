# Pantallas UI — NeuroDaily MVP

## Pantallas Públicas

### 1. Landing Page
- Hero con tagline + CTA "Empezar Gratis"
- 3 features principales con iconos/ilustraciones
- Sección "¿Cómo funciona?" (3 pasos)
- Testimonios (placeholder en MVP)
- CTA final + link a pricing
- Footer con links legales

### 2. Pricing
- 2 columnas: Free vs Pro
- Tabla comparativa de features
- Badge "Más popular" en anual
- CTAs: "Empezar Gratis" / "Obtener Pro"
- Toggle mensual/anual con descuento visible

### 3. Login / Registro
- Clerk components
- Social login (Google, GitHub)
- Redirect post-login: si onboarding completo → dashboard, si no → onboarding

### 4. Términos / Privacidad
- Páginas estáticas de contenido legal
- Disclaimer de no-app-médica

---

## Pantallas Autenticadas (Usuario)

### 5. Onboarding (6 pasos + resumen)
- Progress bar
- Cards seleccionables para cada pregunta
- Animaciones entre pasos (Framer Motion)
- Botón atrás + skip en opcionales

### 6. Dashboard Diario
```
┌─────────────────────────────────┐
│  Hola, [Nombre] 👋              │
│  🔥 Racha: 5 días               │
│                                  │
│  [¿Qué hago ahora?]   ← BOTÓN │
│                                  │
│  📋 Tus tareas hoy (3/5)       │
│  ├─ ✅ Revisar emails           │
│  ├─ 🟡 Preparar informe  [▶]   │
│  └─ 🔴 Estudiar React    [▶]   │
│                                  │
│  📊 Check-in de hoy             │
│  Energía: ███░░ 3/5             │
│  Ansiedad: ████░ 4/5            │
│  [Actualizar check-in]          │
│                                  │
│  [No quiero pensar, ayúdame] 🧠│
└─────────────────────────────────┘
```

### 7. Check-in
- Sliders visuales para energía/ansiedad
- Select para contexto
- Expandible a más campos
- Badge Pro en nivel 3

### 8. Lista de Tareas
- Cards con chip de carga cognitiva (🟢🟡🔴)
- Filtros: categoría, estado
- FAB "+" para crear
- Estado vacío diseñado

### 9. Crear/Editar Tarea
- Form: título, descripción, categoría, carga cognitiva, minutos, fecha
- Detección de vaguedad en título (inline)
- Categorías Pro con badge

### 10. "¿Qué hago ahora?" (Resultado)
- 1 recomendación principal con razón
- 1 alternativa
- Link "Elegir manualmente"
- Contador de usos Free visible

### 11. Modo Primer Paso
- Paso generado con estimación + dificultad
- Botones: Empezar / Más fácil (Pro) / Siguiente (Pro)
- Animación al empezar

### 12. Microacción Guiada
- Título + categoría + duración
- Temporizador countdown
- Instrucciones paso a paso
- Contraindications visibles
- Botones: Pausar / Terminar antes

### 13. Feedback Post-Acción
- Rating estrellas
- Mood emojis
- Comentario opcional
- Botones: Enviar / Omitir

### 14. Historial
- Lista cronológica de sesiones, tareas completadas, check-ins
- Free: 7 días. Pro: 90 días.

### 15. Configuración
- Editar preferencias (re-onboarding)
- Modo discreto toggle
- IA toggle
- Zona horaria
- Tema (futuro)
- Link a gestión de suscripción

### 16. Suscripción
- Plan actual
- Fecha renovación
- Botón "Gestionar" (Stripe Portal)
- Botón "Mejorar a Pro" (si Free)

---

## Pantallas Admin

### 17. Dashboard Admin
- Contadores: microacciones activas, feedback reciente, tasa aceptación
- Top/bottom microacciones por rating

### 18. CRUD Microacciones
- Tabla filtrable/sortable
- Form completo para crear/editar
- Toggle activa/premium inline

### 19. Feedback
- Tabla con rating, comentario, microacción, fecha
- Filtros por rating/categoría

### 20. Logs Recomendaciones
- Tabla con tipo, razón, aceptado, fecha
- Stats de aceptación

---

## Componentes Compartidos
- `Button` (shadcn)
- `Card` (shadcn)
- `Badge` (Free/Pro/categoría)
- `Slider` (check-in)
- `Timer` (countdown)
- `ProgressBar` (onboarding)
- `EmptyState` (ilustración + CTA)
- `PaywallModal` (amable, validador)
- `StreakBadge` (🔥)
- `CognitiveLoadChip` (🟢🟡🔴)
- `DisclaimerBanner` (no-médico)

## Navegación
- Sidebar en desktop / Bottom nav en mobile
- Items: Dashboard, Tareas, Microacciones, Historial, Config
- Admin: sidebar separada
