-- ============================================================
-- 포어캐스트 코리아 DB 스키마
-- ============================================================

-- profiles
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  bio text,
  avatar_url text,
  role text not null default 'user', -- 'user' | 'moderator' | 'admin'
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- categories
create table if not exists categories (
  id serial primary key,
  name text not null,
  slug text not null unique,
  description text,
  display_order int default 0
);

-- questions
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  description text,
  category_id int references categories(id),
  status text not null default 'open', -- 'open' | 'closed' | 'resolved' | 'void'
  resolution text, -- 'yes' | 'no' | 'void' | null
  source_url text,
  resolution_criteria text,
  open_at timestamptz default now(),
  close_at timestamptz not null,
  resolve_by timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid references profiles(id),
  is_featured boolean default false,
  view_count int default 0,
  suggested_by uuid references profiles(id)
);

-- predictions (최신 예측 1개만 유지)
create table if not exists predictions (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  probability numeric(5,2) not null check (probability >= 0 and probability <= 100),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  is_final_before_close boolean default false,
  unique(question_id, user_id)
);

-- prediction_history (변경 이력)
create table if not exists prediction_history (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  probability numeric(5,2) not null,
  created_at timestamptz default now()
);

-- comments
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  question_id uuid references questions(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  deleted_at timestamptz
);

-- scores (결과 확정 후 계산)
create table if not exists scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  probability numeric(5,2) not null,
  brier_score numeric(6,4),
  score int, -- 0~100
  resolved_at timestamptz default now(),
  unique(user_id, question_id)
);

-- user_stats (집계, 트리거로 업데이트)
create table if not exists user_stats (
  user_id uuid primary key references profiles(id) on delete cascade,
  total_predictions int default 0,
  resolved_predictions int default 0,
  average_brier_score numeric(6,4),
  accuracy_score numeric(6,2),
  rank int,
  updated_at timestamptz default now()
);

-- ============================================================
-- 트리거: auth.users 생성 시 profiles 자동 생성
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  insert into public.user_stats (user_id)
  values (new.id);
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- 트리거: profiles updated_at 자동 갱신
-- ============================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger set_profiles_updated_at
  before update on profiles
  for each row execute procedure public.set_updated_at();

create or replace trigger set_questions_updated_at
  before update on questions
  for each row execute procedure public.set_updated_at();

create or replace trigger set_predictions_updated_at
  before update on predictions
  for each row execute procedure public.set_updated_at();

-- ============================================================
-- 인덱스
-- ============================================================
create index if not exists idx_questions_status on questions(status);
create index if not exists idx_questions_category_id on questions(category_id);
create index if not exists idx_questions_close_at on questions(close_at);
create index if not exists idx_questions_view_count on questions(view_count desc);
create index if not exists idx_predictions_question_id on predictions(question_id);
create index if not exists idx_predictions_user_id on predictions(user_id);
create index if not exists idx_prediction_history_question_id on prediction_history(question_id);
create index if not exists idx_comments_question_id on comments(question_id);
create index if not exists idx_scores_user_id on scores(user_id);
