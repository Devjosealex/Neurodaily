# Arquitectura — NeuroDaily MVP

## Overview

```
┌─────────────────────────────────────────────────────────┐
│                    MONOREPO                               │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────┐ │
│  │  apps/web     │  │  apps/api    │  │  packages/     │ │
│  │  Next.js      │  │  NestJS      │  │  shared/       │ │
│  │  React        │  │  Prisma      │  │  types/        │ │
│  │  Tailwind     │  │  PostgreSQL  │  │  validators/   │ │
│  │  shadcn/ui    │  │              │  │                │ │
│  │  Framer Motion│  │              │  │                │ │
│  └──────┬───────┘  └──────┬───────┘  └────────────────┘ │
│         │                  │                              │
│         │    REST API      │                              │
│         └──────────────────┘                              │
└─────────────────────────────────────────────────────────┘
         │                  │
    ┌────┴────┐       ┌────┴────┐
    │ Vercel  │       │ Railway │
    │ Frontend│       │ Backend │
    └─────────┘       │ + PgSQL │
                      └─────────┘

External Services:
  ├── Clerk (Auth)
  ├── Stripe (Payments)
  └── OpenAI (AI - Pro only)
```

## Stack Detallado

### Frontend (apps/web)
| Tech | Versión | Propósito |
|---|---|---|
| Next.js | 14+ (App Router) | Framework React, SSR, routing |
| React | 18+ | UI library |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Utility-first CSS |
| shadcn/ui | Latest | Component library (no depende de versión npm) |
| Framer Motion | 11+ | Animaciones |
| TanStack Query | 5+ | Data fetching + cache |
| Zustand | 4+ | Estado global (si necesario) |

### Backend (apps/api)
| Tech | Versión | Propósito |
|---|---|---|
| NestJS | 10+ | Framework backend |
| TypeScript | 5+ | Type safety |
| Prisma | 5+ | ORM |
| PostgreSQL | 15+ | Base de datos |
| class-validator | Latest | Validación DTOs |
| @clerk/backend | Latest | Auth verification |
| stripe | Latest | SDK pagos |
| openai | 4+ | SDK IA |

### Shared (packages/shared)
- `types/` — Interfaces compartidas frontend/backend
- `validators/` — Schemas de validación compartidos
- `constants/` — Enums, plan limits, categorías

### Deploy
| Componente | Plataforma |
|---|---|
| Frontend | Vercel |
| Backend | Railway |
| PostgreSQL | Railway (add-on) |

## Estructura de Directorios

```
neurodaily/
├── AGENTS.md
├── CLAUDE.md
├── .agents/
│   ├── agents.md
│   ├── skills/
│   └── workflows/
├── apps/
│   ├── web/                    # Next.js
│   │   ├── app/
│   │   │   ├── (public)/       # Landing, pricing, legal
│   │   │   ├── (auth)/         # Login, register
│   │   │   ├── (dashboard)/    # Dashboard, tareas, etc.
│   │   │   ├── (admin)/        # Panel admin
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── ui/             # shadcn components
│   │   │   ├── dashboard/
│   │   │   ├── tasks/
│   │   │   ├── checkin/
│   │   │   ├── micro-actions/
│   │   │   ├── recommendations/
│   │   │   ├── first-step/
│   │   │   ├── admin/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── api.ts          # API client
│   │   │   ├── auth.ts         # Clerk helpers
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   └── styles/
│   └── api/                    # NestJS
│       └── src/
│           ├── modules/
│           │   ├── users/
│           │   ├── onboarding/
│           │   ├── tasks/
│           │   ├── checkins/
│           │   ├── micro-actions/
│           │   ├── recommendations/
│           │   ├── first-step/
│           │   ├── subscriptions/
│           │   └── admin/
│           ├── common/
│           │   ├── guards/     # AuthGuard, AdminGuard, PlanGuard
│           │   ├── decorators/
│           │   ├── filters/
│           │   └── interceptors/
│           └── prisma/
├── packages/
│   └── shared/
│       ├── types/
│       ├── validators/
│       └── constants/
├── specs/
├── docs/
├── seed/
│   └── micro-actions.json
└── package.json                # Monorepo root
```

## Patrones Clave

### Auth Flow
```
Client → Clerk JWT → API AuthGuard → verifica JWT → extrae userId → procede
```

### Plan Restriction Flow
```
Request → AuthGuard → PlanGuard → verifica suscripción + usage_counter → procede o 403
```

### Recommendation Flow
```
Check-in data → Rule Engine → Match rules by priority → Select micro_action/task → Return with reason
```

### First Step Flow
```
Task/text → Detect category → Select template (rules) OR call OpenAI (Pro) → Return step
```

## Decisiones Técnicas

1. **Monorepo sin tool**: Sin Turborepo/Nx en MVP. npm workspaces es suficiente.
2. **REST sobre tRPC**: NestJS usa REST nativo. Tipos compartidos manualmente via `packages/shared`.
3. **JSONB para preferencias**: Flexibilidad sin migraciones por cada campo nuevo.
4. **Usage counters en DB**: No en memoria (persiste entre deploys, soporta horizontal scaling futuro).
5. **Soft deletes**: Microacciones usan `is_active`, no se borran de DB.
6. **Seed JSON**: Microacciones iniciales importables y reseteables.
