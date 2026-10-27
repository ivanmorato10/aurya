-- Somente para testes locais em Postgres puro (sem Docker/Supabase CLI).
-- Reproduz o mínimo do ambiente Supabase usado pela migration:
-- papéis anon/authenticated, tabela auth.users e auth.uid() lendo o JWT.
create role anon nologin;
create role authenticated nologin;
create role service_role nologin bypassrls;

create schema auth;
grant usage on schema auth to anon, authenticated;
grant usage on schema public to anon, authenticated;

create table auth.users (
  id uuid primary key,
  email text
);

create function auth.uid() returns uuid
language sql stable
as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
