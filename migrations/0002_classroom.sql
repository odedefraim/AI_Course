create table if not exists rooms (
  code text primary key,
  level text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists attempts (
  id text primary key,
  room_code text not null references rooms (code),
  client_key text not null,
  score integer not null,
  total integer not null,
  answers jsonb not null,
  created_at timestamptz not null default now(),
  unique (room_code, client_key)
);

create index if not exists attempts_room_code_idx on attempts (room_code);
