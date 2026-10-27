-- AURYA · perfis e quatro momentos do dia
--
-- Um perfil por conta do Supabase Auth. Guarda somente o necessário para o
-- produto: nome opcional, fuso horário e os quatro horários. O catálogo de
-- afirmações é conteúdo público versionado no repositório, não fica no banco.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  time_zone text not null default 'America/Sao_Paulo',
  wake_time time,
  commute_time time,
  midday_time time,
  sleep_time time,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_display_name_length
    check (display_name is null or char_length(display_name) between 1 and 60),
  constraint profiles_time_zone_length
    check (char_length(time_zone) between 1 and 64),
  -- Os horários são definidos juntos no onboarding: ou todos, ou nenhum.
  constraint profiles_schedule_all_or_none check (
    num_nulls(wake_time, commute_time, midday_time, sleep_time) in (0, 4)
  ),
  -- Quatro horários diferentes; a ordem segue o relógio (rotinas noturnas são válidas).
  constraint profiles_schedule_distinct check (
    wake_time is null or (
      wake_time <> commute_time and wake_time <> midday_time and wake_time <> sleep_time
      and commute_time <> midday_time and commute_time <> sleep_time
      and midday_time <> sleep_time
    )
  ),
  -- Precisão de minuto, como no seletor de horário.
  constraint profiles_schedule_minutes check (
    wake_time is null or (
      date_trunc('minute', wake_time::interval) = wake_time::interval
      and date_trunc('minute', commute_time::interval) = commute_time::interval
      and date_trunc('minute', midday_time::interval) = midday_time::interval
      and date_trunc('minute', sleep_time::interval) = sleep_time::interval
    )
  )
);

comment on table public.profiles is 'Preferências da pessoa: nome opcional, fuso e quatro horários.';

-- Fuso válido segundo o próprio Postgres e updated_at automático.
create function public.profiles_before_write()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not exists (select 1 from pg_catalog.pg_timezone_names where name = new.time_zone) then
    raise exception 'invalid time zone' using errcode = '22023';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_before_write
  before insert or update on public.profiles
  for each row execute function public.profiles_before_write();

-- Cria o perfil vazio quando a conta nasce no Supabase Auth.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id) values (new.id) on conflict (id) do nothing;
  return new;
end;
$$;

revoke all on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: cada pessoa lê e altera somente o próprio perfil.
alter table public.profiles enable row level security;

create policy "profiles: ler o próprio"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles: alterar o próprio"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Sem políticas de insert/delete: o perfil nasce pelo gatilho e morre com a conta.

-- Privilégios mínimos: anon não acessa nada; authenticated só altera colunas editáveis.
revoke all on table public.profiles from public, anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (display_name, time_zone, wake_time, commute_time, midday_time, sleep_time)
  on table public.profiles to authenticated;

-- Exclusão da própria conta sem expor a chave service_role à aplicação.
-- Apagar auth.users remove o perfil em cascata. Sessões e identidades do Auth
-- também são removidas em cascata pelo próprio Supabase.
create function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'not authenticated' using errcode = '42501';
  end if;
  delete from auth.users where id = uid;
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
