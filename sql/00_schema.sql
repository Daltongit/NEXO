 create extension if not exists pgcrypto;

create schema if not exists public;

create type public.service_category as enum (
  'Tutorías',
  'Diseño',
  'Desarrollo',
  'Edición',
  'Fotografía',
  'Traducción',
  'Marketing',
  'Redacción',
  'Idiomas',
  'General'
);

create type public.order_status as enum (
  'pending',
  'in_progress',
  'completed',
  'cancelled'
);

create type public.profile_role as enum (
  'student',
  'client',
  'admin'
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    email,
    full_name,
    username,
    career,
    bio,
    avatar_url,
    phone,
    role
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'username', ''),
    coalesce(new.raw_user_meta_data->>'career', ''),
    coalesce(new.raw_user_meta_data->>'bio', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'student'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;