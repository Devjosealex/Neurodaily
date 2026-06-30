# Database Schema — NeuroDaily MVP

## Decisiones de Diseño
- `user_preferences` → JSONB en tabla `users` (no tabla separada)
- `emotional_weight` → removido del MVP
- `clarity_level` → detección algorítmica
- `next_step` → vive en `first_step_logs`
- `usage_counters` → nueva tabla para límites Free
- UUIDs como primary keys
- Timestamps en UTC
- Soft deletes donde aplique (is_active)

## Tablas

### users
```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id   VARCHAR(255) UNIQUE NOT NULL,
  email           VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(255),
  role            VARCHAR(50) DEFAULT 'user', -- user, admin
  timezone        VARCHAR(100) DEFAULT 'UTC',
  preferences     JSONB DEFAULT '{}',
  streak_count    INT DEFAULT 0,
  streak_last_date DATE NULLABLE,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);
```

### daily_checkins
```sql
CREATE TABLE daily_checkins (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  energy_level    INT NOT NULL CHECK (energy_level BETWEEN 1 AND 5),
  anxiety_level   INT NOT NULL CHECK (anxiety_level BETWEEN 1 AND 5),
  current_context VARCHAR(50) NOT NULL,
  sleep_quality   INT CHECK (sleep_quality BETWEEN 1 AND 5),
  available_time  INT, -- minutes
  can_move        BOOLEAN,
  mental_clarity  INT CHECK (mental_clarity BETWEEN 1 AND 5),
  current_state   VARCHAR(50),
  checkin_level   INT NOT NULL DEFAULT 1 CHECK (checkin_level BETWEEN 1 AND 3),
  created_at      TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_checkins_user_date ON daily_checkins(user_id, created_at DESC);
```

### tasks
```sql
CREATE TABLE tasks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title             VARCHAR(255) NOT NULL,
  description       TEXT,
  category          VARCHAR(50) NOT NULL,
  cognitive_load    VARCHAR(20) NOT NULL, -- low, medium, high
  estimated_minutes INT,
  due_date          TIMESTAMP,
  status            VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, in_progress, completed, postponed
  created_at        TIMESTAMP DEFAULT NOW(),
  updated_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
```

### micro_actions
```sql
CREATE TABLE micro_actions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 VARCHAR(255) NOT NULL,
  slug                  VARCHAR(255) UNIQUE NOT NULL,
  category              VARCHAR(50) NOT NULL,
  goal                  VARCHAR(100) NOT NULL,
  description           TEXT,
  duration_seconds      INT NOT NULL,
  difficulty            VARCHAR(20) NOT NULL, -- easy, medium, hard
  energy_required       VARCHAR(20) NOT NULL, -- low, medium, high
  recommended_contexts  JSONB DEFAULT '[]',
  anxiety_levels        JSONB DEFAULT '[]',
  cognitive_load_match  VARCHAR(20),
  instructions          JSONB DEFAULT '[]',
  contraindications     JSONB DEFAULT '[]',
  is_active             BOOLEAN DEFAULT true,
  is_premium            BOOLEAN DEFAULT false,
  created_by_admin      BOOLEAN DEFAULT true,
  sort_order            INT DEFAULT 0,
  created_at            TIMESTAMP DEFAULT NOW(),
  updated_at            TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_micro_actions_category ON micro_actions(category, is_active);
```

### user_micro_action_feedback
```sql
CREATE TABLE user_micro_action_feedback (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  micro_action_id UUID NOT NULL REFERENCES micro_actions(id),
  rating          INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  feedback        TEXT,
  created_at      TIMESTAMP DEFAULT NOW()
);
```

### focus_sessions
```sql
CREATE TABLE focus_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id         UUID REFERENCES tasks(id),
  micro_action_id UUID REFERENCES micro_actions(id),
  started_at      TIMESTAMP NOT NULL,
  ended_at        TIMESTAMP,
  completed       BOOLEAN DEFAULT false,
  mood_after      INT CHECK (mood_after BETWEEN 1 AND 5),
  created_at      TIMESTAMP DEFAULT NOW()
);
```

### subscriptions
```sql
CREATE TABLE subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  stripe_customer_id      VARCHAR(255) UNIQUE,
  stripe_subscription_id  VARCHAR(255) UNIQUE,
  plan                    VARCHAR(20) NOT NULL DEFAULT 'free',
  status                  VARCHAR(20) NOT NULL DEFAULT 'active',
  current_period_end      TIMESTAMP,
  cancel_at_period_end    BOOLEAN DEFAULT false,
  created_at              TIMESTAMP DEFAULT NOW(),
  updated_at              TIMESTAMP DEFAULT NOW()
);
```

### recommendation_logs
```sql
CREATE TABLE recommendation_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_context     JSONB NOT NULL,
  recommended_type  VARCHAR(50) NOT NULL,
  recommended_id    UUID,
  reason            TEXT NOT NULL,
  accepted          BOOLEAN,
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_rec_logs_user ON recommendation_logs(user_id, created_at DESC);
```

### first_step_logs
```sql
CREATE TABLE first_step_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task_id           UUID REFERENCES tasks(id),
  original_text     TEXT NOT NULL,
  generated_step    TEXT NOT NULL,
  difficulty_level  INT NOT NULL CHECK (difficulty_level BETWEEN 1 AND 4),
  generation_method VARCHAR(20) NOT NULL, -- rules, ai
  accepted          BOOLEAN,
  created_at        TIMESTAMP DEFAULT NOW()
);
```

### usage_counters
```sql
CREATE TABLE usage_counters (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  counter_type    VARCHAR(50) NOT NULL,
  counter_date    DATE NOT NULL,
  count           INT DEFAULT 0,
  UNIQUE(user_id, counter_type, counter_date)
);

CREATE INDEX idx_usage_user_date ON usage_counters(user_id, counter_date);
```

## Relaciones

```
users 1──N daily_checkins
users 1──N tasks
users 1──N focus_sessions
users 1──N recommendation_logs
users 1──N first_step_logs
users 1──N user_micro_action_feedback
users 1──N usage_counters
users 1──1 subscriptions
tasks 1──N focus_sessions
tasks 1──N first_step_logs
micro_actions 1──N focus_sessions
micro_actions 1──N user_micro_action_feedback
```
