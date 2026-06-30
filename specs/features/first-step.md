# Feature: Modo Primer Paso — NeuroDaily

## Descripción
Descompone tareas vagas o grandes en un único primer paso microscópico y ejecutable. Basado en Intenciones de Implementación (Gollwitzer, 1999). Funciona con reglas básicas (Free) y con OpenAI (Pro).

## User Stories
- Como usuario, quiero que al presionar "No sé por dónde empezar", la app me dé UN solo paso concreto.
- Como usuario, quiero poder pedir un paso aún más fácil si el sugerido me parece difícil.
- Como usuario Pro, quiero que la IA genere pasos contextualizados a mi tarea específica.

## Niveles de Dificultad

| Nivel | Nombre | Ejemplo (tarea: "Preparar informe") | Plan |
|---|---|---|---|
| 1 | Normal | "Escribe 3 ideas principales del informe" | Free |
| 2 | Pequeño | "Escribe 1 idea principal" | Pro |
| 3 | Microscópico | "Abre el documento" | Pro |
| 4 | Bloqueo total | "Solo ponle nombre al archivo" | Pro |

Free: 3 usos/día, solo nivel 1 (y 1 vez "más fácil" que baja a nivel 2).
Pro: ilimitado, 4 niveles completos.

## Motor de Generación

### Modo Reglas (Free + Fallback)
Templates por categoría:

**Trabajo:**
- Nivel 1: "Escribe 3 ideas principales para {task_title}"
- Nivel 2: "Escribe 1 idea para {task_title}"
- Nivel 3: "Abre el documento/herramienta donde harás {task_title}"
- Nivel 4: "Ponle nombre al archivo de {task_title}"

**Estudio:**
- Nivel 1: "Escribe el nombre exacto del tema a estudiar"
- Nivel 2: "Busca una definición de {task_title}"
- Nivel 3: "Abre el material de estudio"
- Nivel 4: "Escribe la materia en un papel o nota"

**Programación:**
- Nivel 1: "Crea el archivo/componente con el nombre correcto"
- Nivel 2: "Escribe el import o la primera línea"
- Nivel 3: "Abre el proyecto en tu editor"
- Nivel 4: "Abre la terminal"

**Bienestar:**
- Nivel 1: "Pon ambos pies en el piso y baja los hombros"
- Nivel 2: "Cierra los ojos 10 segundos"
- Nivel 3: "Toma un vaso de agua"
- Nivel 4: "Solo respira normalmente 3 veces"

**Hobby:**
- Nivel 1: "Dedica 5 minutos a {task_title}"
- Nivel 2: "Abre la app/herramienta de tu hobby"
- Nivel 3: "Traza una línea/escribe una palabra/toca una nota"
- Nivel 4: "Solo piensa en qué te gustaría hacer"

### Modo IA (Pro)
- Usa OpenAI API para generar primer paso contextualizado
- Prompt incluye: task_title, task_description, category, user_context, difficulty_level
- Fallback a templates si OpenAI falla

## Modelo de Datos

```sql
first_step_logs
  id                UUID PRIMARY KEY
  user_id           UUID REFERENCES users(id)
  task_id           UUID NULLABLE REFERENCES tasks(id)
  original_text     TEXT NOT NULL
  generated_step    TEXT NOT NULL
  difficulty_level  INT NOT NULL (1-4)
  generation_method VARCHAR NOT NULL -- rules, ai
  accepted          BOOLEAN NULLABLE
  created_at        TIMESTAMP
```

## Endpoints

### POST /first-step/generate
- **Auth:** Requerida
- **Body:** `{ task_id?: string, free_text?: string, action: "initial" | "easier" | "next" }`
- **Validación Free:** 3 usos "initial"/día + 1 "easier". "next" solo Pro.
- **Response:**
```json
{
  "step": "Abre el documento y escribe el título provisional.",
  "difficulty_level": 1,
  "estimated_minutes": 2,
  "generation_method": "rules",
  "can_go_easier": true,
  "can_go_next": false
}
```

## Pantalla

```
┌────────────────────────────────┐
│  Modo Primer Paso              │
│                                │
│  Tarea: Preparar informe       │
│                                │
│  Tu primer paso:               │
│  "Abre el documento y escribe  │
│   el título provisional."      │
│                                │
│  ⏱ ~2 minutos | Fácil         │
│                                │
│  [Empezar]                    │
│  [Dame algo más fácil] ← Pro  │
│  [Siguiente paso] ← Pro       │
└────────────────────────────────┘
```

## Reglas de Negocio
- Primer paso SIEMPRE debe ser: concreto, ejecutable en <2min, sin necesidad de pensar mucho
- "easier" baja un nivel de dificultad
- "next" genera el siguiente paso asumiendo que el anterior se completó
- Si task_id provisto, log se vincula a la tarea
- Si free_text provisto, se genera sin vincular a tarea existente

## Restricciones por Plan
- Free: 3 initial/día, 1 easier (solo baja a nivel 2), sin "next"
- Pro: ilimitado, 4 niveles, "next" disponible, generación IA

## Edge Cases
- Texto libre vacío → error 400 "Describe brevemente tu tarea"
- Tarea ya completada → error 400 "Esta tarea ya está completada"
- OpenAI falla → fallback a templates, log method="rules"
- Nivel 4 + "easier" → "Este es el paso más pequeño posible. Puedes simplemente empezar."

## Criterios de Aceptación
- [ ] Genera primer paso concreto por reglas
- [ ] Genera primer paso por IA (Pro)
- [ ] 4 niveles de dificultad
- [ ] Botón "Dame algo más fácil" funcional
- [ ] Free limitado a 3/día + 1 easier
- [ ] Fallback a reglas si IA falla
- [ ] Log registrado en DB
- [ ] Paso siempre <2min y concreto
- [ ] Funciona con task_id o free_text

## Dependencias
- Sprint 2 (tareas)
- OpenAI API (solo Pro)
