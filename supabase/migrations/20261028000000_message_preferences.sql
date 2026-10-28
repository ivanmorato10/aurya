-- AURYA · tipos de mensagem que a pessoa quer receber
--
-- message_types: ao menos um entre os quatro tipos do catálogo.
-- include_quotes: inclui ou não as citações de Napoleon Hill (com fonte).
-- Migration aditiva: perfis existentes recebem todos os tipos e citações ligadas.

alter table public.profiles
  add column message_types text[] not null default array['prosperidade', 'confianca', 'proposito', 'gratidao'],
  add column include_quotes boolean not null default true;

alter table public.profiles
  add constraint profiles_message_types_valid check (
    cardinality(message_types) between 1 and 4
    and message_types <@ array['prosperidade', 'confianca', 'proposito', 'gratidao']
  );

grant update (message_types, include_quotes) on table public.profiles to authenticated;
