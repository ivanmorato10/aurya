-- Testes de RLS, privilégios e regras do perfil.
-- Executados por scripts/test-db.sh. Cada bloco lança exceção se a regra falhar.
\set ON_ERROR_STOP on

-- Duas contas criadas como o Supabase Auth faria.
insert into auth.users (id, email) values
  ('11111111-1111-1111-1111-111111111111', 'a@example.com'),
  ('22222222-2222-2222-2222-222222222222', 'b@example.com');

do $$ begin
  assert (select count(*) from public.profiles) = 2, 'gatilho deveria criar um perfil por conta';
  assert (select time_zone from public.profiles where id = '11111111-1111-1111-1111-111111111111') = 'America/Sao_Paulo';
end $$;

-- Helper: age como a pessoa A
create function pg_temp.as_user(uid text) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', uid, false);
  execute 'set role authenticated';
end $$;

-- 1. A lê somente o próprio perfil
select pg_temp.as_user('11111111-1111-1111-1111-111111111111');
do $$ begin
  assert (select count(*) from public.profiles) = 1, 'A deveria ver apenas o próprio perfil';
  assert (select id from public.profiles) = '11111111-1111-1111-1111-111111111111';
end $$;

-- 2. A atualiza o próprio horário
update public.profiles set wake_time = '06:45', commute_time = '08:15', midday_time = '13:00', sleep_time = '23:00', display_name = 'Ana'
  where id = '11111111-1111-1111-1111-111111111111';

-- 3. A não altera B (RLS filtra: zero linhas afetadas)
do $$
declare n int;
begin
  update public.profiles set display_name = 'invasão' where id = '22222222-2222-2222-2222-222222222222';
  get diagnostics n = row_count;
  assert n = 0, 'A não deveria alterar o perfil de B';
end $$;

-- 4. A não muda o próprio id para o de B
do $$ begin
  begin
    update public.profiles set id = '22222222-2222-2222-2222-222222222222' where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'deveria negar update de id';
  exception when insufficient_privilege then null;
  end;
end $$;

-- 5. A não insere nem apaga perfis diretamente
do $$ begin
  begin
    insert into public.profiles (id) values ('33333333-3333-3333-3333-333333333333');
    raise exception 'deveria negar insert';
  exception when insufficient_privilege then null;
  end;
  begin
    delete from public.profiles where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'deveria negar delete';
  exception when insufficient_privilege then null;
  end;
end $$;

-- 6. Regras de horário: duplicados, parciais, segundos e fuso inválido
do $$ begin
  begin
    update public.profiles set sleep_time = '06:45' where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'deveria rejeitar horários repetidos';
  exception when check_violation then null;
  end;
  begin
    update public.profiles set sleep_time = null where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'deveria rejeitar horários parciais';
  exception when check_violation then null;
  end;
  begin
    update public.profiles set sleep_time = '23:00:30' where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'deveria rejeitar segundos';
  exception when check_violation then null;
  end;
  begin
    update public.profiles set time_zone = 'Lua/Base' where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'deveria rejeitar fuso inválido';
  exception when invalid_parameter_value then null;
  end;
  begin
    update public.profiles set display_name = repeat('x', 61) where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'deveria rejeitar nome longo';
  exception when check_violation then null;
  end;
end $$;

-- 7. Rotina noturna (ordem livre) é aceita
update public.profiles set wake_time = '15:00', commute_time = '17:30', midday_time = '22:00', sleep_time = '07:30', time_zone = 'America/Los_Angeles'
  where id = '11111111-1111-1111-1111-111111111111';

-- 8. Sem sessão (anon) nada é visível nem executável
reset role;
select set_config('request.jwt.claim.sub', '', false);
set role anon;
do $$ begin
  begin
    perform 1 from public.profiles;
    raise exception 'anon não deveria ler perfis';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.delete_my_account();
    raise exception 'anon não deveria excluir contas';
  exception when insufficient_privilege then null;
  end;
end $$;

-- 9. Authenticated sem sub não exclui nada
reset role;
set role authenticated;
do $$ begin
  begin
    perform public.delete_my_account();
    raise exception 'sem uid deveria falhar';
  exception when insufficient_privilege then null;
  end;
end $$;

-- 10. B exclui a própria conta; A permanece
reset role;
select pg_temp.as_user('22222222-2222-2222-2222-222222222222');
select public.delete_my_account();
reset role;
do $$ begin
  assert not exists (select 1 from auth.users where id = '22222222-2222-2222-2222-222222222222'), 'conta de B deveria ser apagada';
  assert not exists (select 1 from public.profiles where id = '22222222-2222-2222-2222-222222222222'), 'perfil de B deveria ser apagado em cascata';
  assert exists (select 1 from public.profiles where id = '11111111-1111-1111-1111-111111111111'), 'perfil de A deve permanecer';
end $$;

-- 11. Tipos de mensagem: padrão com todos; A altera os próprios; valores inválidos ou vazios são recusados
select pg_temp.as_user('11111111-1111-1111-1111-111111111111');
do $$ begin
  assert (select cardinality(message_types) from public.profiles) = 4, 'padrão deveria ter os quatro tipos';
  assert (select include_quotes from public.profiles), 'citações ligadas por padrão';
end $$;
update public.profiles set message_types = array['gratidao'], include_quotes = false where id = '11111111-1111-1111-1111-111111111111';
do $$ begin
  begin
    update public.profiles set message_types = array[]::text[] where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'deveria recusar lista vazia';
  exception when check_violation then null;
  end;
  begin
    update public.profiles set message_types = array['loteria'] where id = '11111111-1111-1111-1111-111111111111';
    raise exception 'deveria recusar tipo desconhecido';
  exception when check_violation then null;
  end;
end $$;
reset role;

select 'rls: todos os testes passaram' as resultado;
