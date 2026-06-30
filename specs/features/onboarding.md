# Feature: Onboarding — NeuroDaily

## Descripción
Flujo de configuración inicial tras primer login. Recopila preferencias para personalizar recomendaciones y experiencia.

## User Stories
- Como usuario nuevo, quiero configurar mis preferencias para que la app me recomiende pausas y acciones relevantes a mi contexto.
- Como usuario nuevo, quiero indicar qué tipo de pausas no me gustan para no recibirlas como recomendación.
- Como usuario nuevo, quiero definir mi contexto habitual (oficina, casa, transporte) para recibir sugerencias adecuadas.

## Campos del Onboarding

| Campo | Tipo | Opciones | Requerido |
|---|---|---|---|
| objectives | multi-select | work, study, wellness, habits, hobbies | Sí |
| preferred_break_types | multi-select | breathing, stretching, walking, visual_rest, mindfulness, creative | Sí |
| disliked_break_types | multi-select | (mismas opciones) | No |
| frequent_context | select | home, office, university, transport, mixed | Sí |
| intensity_preference | select | soft, balanced, demanding | Sí |
| peak_energy_hours | multi-select | morning, midday, afternoon, evening, night | Sí |
| discrete_mode | boolean | — | No (default: false) |
| use_ai_decomposition | boolean | — | No (default: true) |
| timezone | auto-detect + manual | — | Sí |

## Modelo de Datos
Se almacena como JSONB en campo `preferences` de tabla `users`.

```json
{
  "objectives": ["work", "study"],
  "preferred_break_types": ["breathing", "walking"],
  "disliked_break_types": ["mindfulness"],
  "frequent_context": "office",
  "intensity_preference": "balanced",
  "peak_energy_hours": ["morning", "midday"],
  "discrete_mode": true,
  "use_ai_decomposition": true,
  "timezone": "America/Mexico_City",
  "onboarding_completed": true,
  "onboarding_completed_at": "2025-01-15T10:00:00Z"
}
```

## Endpoints

### POST /onboarding
- **Auth:** Requerida
- **Body:** Objeto con todos los campos del onboarding
- **Response:** `{ success: true, preferences: {...} }`
- **Errores:** 400 (validación), 409 (onboarding ya completado)

### GET /onboarding/status
- **Auth:** Requerida
- **Response:** `{ completed: boolean, completedAt: string | null }`

## Pantallas
1. **Paso 1:** Objetivos (multi-select cards)
2. **Paso 2:** Tipo de pausas preferidas
3. **Paso 3:** Pausas que no te gustan (skip disponible)
4. **Paso 4:** Contexto + modo discreto
5. **Paso 5:** Intensidad + horarios de energía
6. **Paso 6:** IA y zona horaria
7. **Resumen:** Confirmar y empezar

## UX
- Progress bar visible
- Botón "Atrás" en cada paso
- Skip en pasos opcionales
- Animaciones suaves entre pasos (Framer Motion)
- Tono cálido, no clínico

## Restricciones por Plan
No aplica — onboarding es igual para Free y Pro.

## Edge Cases
- Usuario cierra browser a mitad → guardar progreso parcial en localStorage
- Usuario intenta acceder al dashboard sin completar onboarding → redirigir a onboarding
- Usuario quiere re-hacer onboarding → disponible en Configuración

## Criterios de Aceptación
- [ ] El usuario puede completar todos los pasos del onboarding
- [ ] Las preferencias se guardan correctamente en DB
- [ ] El progress bar avanza correctamente
- [ ] Se puede navegar atrás entre pasos
- [ ] Se puede skip en pasos opcionales
- [ ] El onboarding redirige al dashboard al completar
- [ ] No se puede acceder al dashboard sin onboarding completado
- [ ] La zona horaria se auto-detecta

## Dependencias
- Sprint 1 (auth con Clerk, modelo de usuario)
