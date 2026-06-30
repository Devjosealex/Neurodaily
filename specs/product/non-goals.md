# Non-Goals — NeuroDaily MVP

## Lo Que NO Se Implementa en el MVP

### Producto
- ❌ App móvil nativa (solo web responsive)
- ❌ Gamificación compleja (logros, badges, niveles)
- ❌ Social features (compartir, amigos, grupos)
- ❌ Integración con calendarios externos (Google Calendar, Outlook)
- ❌ Notificaciones push
- ❌ Modo offline
- ❌ Multi-idioma (solo español inicialmente)
- ❌ Temas visuales personalizables
- ❌ Marketplace de microacciones
- ❌ Plantillas de rutinas predefinidas (excepto microacciones base)

### Técnico
- ❌ IA generativa compleja (solo OpenAI para Primer Paso Pro)
- ❌ Machine Learning para recomendaciones (solo reglas)
- ❌ Real-time / WebSockets
- ❌ Caché distribuida (Redis)
- ❌ Queue system (Bull, RabbitMQ)
- ❌ Microservicios (monolito modular)
- ❌ CDN para assets
- ❌ Logging avanzado (solo logs básicos en DB)
- ❌ A/B testing
- ❌ Analytics avanzados

### Médico/Terapéutico
- ❌ Diagnóstico de condiciones mentales
- ❌ Seguimiento de medicación
- ❌ Reportes clínicos
- ❌ Conexión con profesionales de salud
- ❌ Evaluaciones psicológicas
- ❌ Lenguaje de tratamiento o curación
- ❌ Respiraciones avanzadas (Wim Hof) sin advertencias extremas
- ❌ Recomendaciones de ejercicio intenso

### Admin
- ❌ Dashboard con analytics complejos
- ❌ Gestión de usuarios (solo gestión de contenido)
- ❌ Roles admin múltiples
- ❌ Exportación masiva de datos
- ❌ APIs públicas

### Seguridad Avanzada
- ❌ 2FA (Clerk maneja auth)
- ❌ Auditoría completa de acciones
- ❌ Encriptación at-rest personalizada
- ❌ GDPR compliance completo (solo borrado básico futuro)
- ❌ SOC 2

## Regla
Si algo de esta lista aparece como feature durante el desarrollo → el Orquestador debe rechazarlo y documentar por qué.
