 create or replace function public.calculate_order_amounts()
returns trigger
language plpgsql
as $$
begin
  new.platform_fee := round((new.total_price * 0.10)::numeric, 2);
  new.student_earnings := round((new.total_price - new.platform_fee)::numeric, 2);
  return new;
end;
$$;

drop trigger if exists orders_calculate_amounts on public.orders;
create trigger orders_calculate_amounts
before insert or update on public.orders
for each row
execute function public.calculate_order_amounts();

create or replace function public.refresh_profile_rating(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  review_count integer;
  average_rating numeric(3,2);
begin
  select
    count(*)::integer,
    coalesce(round(avg(rating)::numeric, 2), 0)
  into review_count, average_rating
  from public.reviews
  where reviewed_user_id = target_user_id;

  update public.profiles
  set
    total_reviews = review_count,
    rating = average_rating,
    updated_at = timezone('utc', now())
  where id = target_user_id;
end;
$$;

create or replace function public.handle_review_rating_refresh()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    perform public.refresh_profile_rating(old.reviewed_user_id);
    return old;
  end if;

  perform public.refresh_profile_rating(new.reviewed_user_id);
  return new;
end;
$$;

drop trigger if exists reviews_refresh_rating on public.reviews;
create trigger reviews_refresh_rating
after insert or update or delete on public.reviews
for each row
execute function public.handle_review_rating_refresh();

create or replace function public.create_order_from_service(
  p_service_id uuid,
  p_client_id uuid,
  p_notes text default ''
)
returns public.orders
language plpgsql
security definer
set search_path = public
as $$
declare
  service_row public.services;
  created_order public.orders;
begin
  select *
  into service_row
  from public.services
  where id = p_service_id
    and is_active = true;

  if service_row.id is null then
    raise exception 'Servicio no encontrado o inactivo';
  end if;

  insert into public.orders (
    service_id,
    student_id,
    client_id,
    total_price,
    notes
  )
  values (
    service_row.id,
    service_row.owner_id,
    p_client_id,
    service_row.price,
    coalesce(p_notes, '')
  )
  returning * into created_order;

  return created_order;
end;
$$;