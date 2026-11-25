create table if not exists public.admin_auth (
  id text primary key,
  password_hash text not null
);

alter table public.admin_auth enable row level security;
