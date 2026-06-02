 alter table public.profiles enable row level security;
alter table public.services enable row level security;
alter table public.orders enable row level security;
alter table public.messages enable row level security;
alter table public.reviews enable row level security;
alter table public.portfolio_items enable row level security;

drop policy if exists "profiles_select_own_or_public" on public.profiles;
create policy "profiles_select_own_or_public"
on public.profiles
for select
to authenticated
using (true);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
to authenticated
with check (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "services_select_public" on public.services;
create policy "services_select_public"
on public.services
for select
to authenticated
using (true);

drop policy if exists "services_insert_own" on public.services;
create policy "services_insert_own"
on public.services
for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "services_update_own" on public.services;
create policy "services_update_own"
on public.services
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "services_delete_own" on public.services;
create policy "services_delete_own"
on public.services
for delete
to authenticated
using (auth.uid() = owner_id);

drop policy if exists "orders_select_participants" on public.orders;
create policy "orders_select_participants"
on public.orders
for select
to authenticated
using (auth.uid() = student_id or auth.uid() = client_id);

drop policy if exists "orders_insert_client_or_student" on public.orders;
create policy "orders_insert_client_or_student"
on public.orders
for insert
to authenticated
with check (auth.uid() = client_id or auth.uid() = student_id);

drop policy if exists "orders_update_participants" on public.orders;
create policy "orders_update_participants"
on public.orders
for update
to authenticated
using (auth.uid() = student_id or auth.uid() = client_id)
with check (auth.uid() = student_id or auth.uid() = client_id);

drop policy if exists "messages_select_participants" on public.messages;
create policy "messages_select_participants"
on public.messages
for select
to authenticated
using (auth.uid() = sender_id or auth.uid() = receiver_id);

drop policy if exists "messages_insert_sender" on public.messages;
create policy "messages_insert_sender"
on public.messages
for insert
to authenticated
with check (auth.uid() = sender_id);

drop policy if exists "reviews_select_public" on public.reviews;
create policy "reviews_select_public"
on public.reviews
for select
to authenticated
using (true);

drop policy if exists "reviews_insert_reviewer" on public.reviews;
create policy "reviews_insert_reviewer"
on public.reviews
for insert
to authenticated
with check (auth.uid() = reviewer_id);

drop policy if exists "portfolio_select_public" on public.portfolio_items;
create policy "portfolio_select_public"
on public.portfolio_items
for select
to authenticated
using (true);

drop policy if exists "portfolio_insert_own" on public.portfolio_items;
create policy "portfolio_insert_own"
on public.portfolio_items
for insert
to authenticated
with check (auth.uid() = owner_id);

drop policy if exists "portfolio_update_own" on public.portfolio_items;
create policy "portfolio_update_own"
on public.portfolio_items
for update
to authenticated
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "portfolio_delete_own" on public.portfolio_items;
create policy "portfolio_delete_own"
on public.portfolio_items
for delete
to authenticated
using (auth.uid() = owner_id);