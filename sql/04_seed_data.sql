 insert into public.services (
  owner_id,
  title,
  category,
  price,
  description,
  is_active
)
select
  p.id,
  'Diseño de logotipo universitario',
  'Diseño',
  20.00,
  'Creación de logotipo para emprendimientos, proyectos académicos o marcas personales con enfoque visual limpio y profesional.',
  true
from public.profiles p
order by p.created_at asc
limit 1
on conflict do nothing;

insert into public.services (
  owner_id,
  title,
  category,
  price,
  description,
  is_active
)
select
  p.id,
  'Tutorías de programación web',
  'Desarrollo',
  15.00,
  'Sesiones de apoyo en HTML, CSS, JavaScript y fundamentos de desarrollo web para estudiantes que necesiten refuerzo práctico.',
  true
from public.profiles p
order by p.created_at asc
limit 1
on conflict do nothing;

insert into public.services (
  owner_id,
  title,
  category,
  price,
  description,
  is_active
)
select
  p.id,
  'Edición de video para contenido académico',
  'Edición',
  25.00,
  'Edición de clips, cortes, subtítulos y estructura visual para exposiciones, presentaciones o contenido para redes.',
  true
from public.profiles p
order by p.created_at asc
limit 1
on conflict do nothing;

insert into public.portfolio_items (
  owner_id,
  title,
  description,
  item_type,
  project_url
)
select
  p.id,
  'Muestra inicial de portafolio',
  'Ejemplo base para comenzar a poblar el perfil profesional del estudiante dentro de la plataforma.',
  'Proyecto',
  ''
from public.profiles p
order by p.created_at asc
limit 1
on conflict do nothing;