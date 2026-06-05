-- ============================================================
-- Row Level Security 정책
-- ============================================================

-- profiles
alter table profiles enable row level security;

create policy "public read profiles"
  on profiles for select using (true);

create policy "insert own profile"
  on profiles for insert with check (auth.uid() = id);

create policy "own profile update"
  on profiles for update using (auth.uid() = id);

-- categories
alter table categories enable row level security;

create policy "public read categories"
  on categories for select using (true);

create policy "admin manage categories"
  on categories for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'moderator'))
  );

-- questions
alter table questions enable row level security;

create policy "public read questions"
  on questions for select using (true);

create policy "admin create questions"
  on questions for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'moderator'))
  );

create policy "admin update questions"
  on questions for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'moderator'))
  );

create policy "admin delete questions"
  on questions for delete using (
    exists (select 1 from profiles where id = auth.uid() and role = 'admin')
  );

-- predictions
alter table predictions enable row level security;

create policy "public read predictions"
  on predictions for select using (true);

create policy "own prediction insert"
  on predictions for insert with check (auth.uid() = user_id);

create policy "own prediction update"
  on predictions for update using (auth.uid() = user_id);

-- prediction_history
alter table prediction_history enable row level security;

create policy "public read prediction_history"
  on prediction_history for select using (true);

create policy "own history insert"
  on prediction_history for insert with check (auth.uid() = user_id);

-- comments
alter table comments enable row level security;

create policy "public read comments"
  on comments for select using (deleted_at is null);

create policy "auth insert comment"
  on comments for insert with check (auth.uid() = user_id);

create policy "own or admin delete comment"
  on comments for update using (
    auth.uid() = user_id or
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'moderator'))
  );

-- scores
alter table scores enable row level security;

create policy "public read scores"
  on scores for select using (true);

create policy "admin insert scores"
  on scores for insert with check (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'moderator'))
  );

create policy "admin update scores"
  on scores for update using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'moderator'))
  );

-- user_stats
alter table user_stats enable row level security;

create policy "public read user_stats"
  on user_stats for select using (true);

create policy "admin manage user_stats"
  on user_stats for all using (
    exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'moderator'))
  );
