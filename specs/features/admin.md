# Feature: Panel Admin — NeuroDaily

## Descripción
Panel para administrar microacciones, categorías, feedback y logs sin tocar código.

## User Stories
- Como admin, quiero crear microacciones nuevas desde un formulario.
- Como admin, quiero activar/desactivar microacciones sin deploy.
- Como admin, quiero ver el feedback de los usuarios para mejorar las microacciones.
- Como admin, quiero ver qué recomienda el motor para detectar problemas.

## Acceso
- Ruta: `/admin/*`
- Solo usuarios con `role: admin` en DB
- Guard específico de admin

## Pantallas

### 1. Dashboard Admin
- Total microacciones activas/inactivas
- Total feedback recibido (últimos 7 días)
- Top 5 microacciones mejor calificadas
- Top 5 microacciones peor calificadas

### 2. CRUD Microacciones
**Lista:**
- Tabla con: título, categoría, duración, activa, premium, rating promedio
- Filtros: categoría, estado, premium
- Acciones: editar, activar/desactivar, eliminar

**Crear/Editar:**
- Formulario con todos los campos de `micro_actions`
- Preview de instrucciones
- Preview de contraindicaciones
- Toggle activa/premium

### 3. Categorías
- Lista de categorías
- Crear/editar/eliminar categorías
- Reordenar categorías

### 4. Feedback de Usuarios
- Tabla con: microacción, usuario (anonimizado), rating, comentario, fecha
- Filtros: rating, categoría, fecha
- Exportar CSV

### 5. Logs de Recomendaciones
- Tabla con: usuario (anonimizado), tipo recomendado, razón, aceptado, fecha
- Filtros: tipo, aceptado/rechazado, fecha
- Estadísticas: tasa de aceptación por tipo

### 6. Límites por Plan
- Visualización de los límites actuales Free/Pro
- No editable en MVP (configuración fija en código)

## Endpoints Admin

### GET /admin/micro-actions
- **Auth:** Admin required
- **Query:** `?category=breathing&active=true&premium=false`
- **Response:** Array completo con stats

### POST /admin/micro-actions
- **Auth:** Admin required
- **Body:** Objeto micro_action completo
- **Response:** Micro acción creada

### PATCH /admin/micro-actions/:id
- **Auth:** Admin required
- **Body:** Campos a actualizar
- **Response:** Micro acción actualizada

### DELETE /admin/micro-actions/:id
- **Auth:** Admin required
- **Response:** `{ deleted: true }`

### GET /admin/feedback
- **Auth:** Admin required
- **Query:** `?rating_min=1&rating_max=3&limit=50`
- **Response:** Array de feedback con microacción asociada

### GET /admin/recommendation-logs
- **Auth:** Admin required
- **Query:** `?type=micro_action&accepted=true&limit=50`
- **Response:** Array de logs con stats

## Reglas de Negocio
- Solo admins acceden a `/admin/*`
- Datos de usuario en feedback → anonimizados (sin email/nombre)
- Eliminar microacción → soft delete (is_active = false, no borra de DB)
- Seed de microacciones → importable desde `seed/micro-actions.json`

## Edge Cases
- Admin elimina microacción que está en una focus_session activa → no afecta session activa
- Admin desactiva microacción → deja de aparecer en recomendaciones inmediatamente
- Admin marca como premium → usuarios Free pierden acceso inmediato

## Criterios de Aceptación
- [ ] Solo admins pueden acceder al panel
- [ ] CRUD completo de microacciones
- [ ] Activar/desactivar sin deploy
- [ ] Marcar premium/free
- [ ] Ver feedback anonimizado
- [ ] Ver logs de recomendaciones
- [ ] Soft delete (no borra de DB)
- [ ] Seed importable desde JSON

## Dependencias
- Sprint 3 (microacciones)
- Sprint 4 (recomendador, logs)
