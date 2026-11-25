-- Sample data. Every user's password is "123456" (bcrypt, cost 10).
-- Rows are linked to users by mail, so ids do not need to be known.

insert into public.usuarios (name, mail, password) values
  ('Marcos', 'marcos@test.com', '$2b$10$Ek9VbZukyg4AV5veUCNsyuynpIl.mfYwRBoGtYHRmsiTdBtYuvRj6'),
  ('Lucia',  'lucia@test.com',  '$2b$10$Ek9VbZukyg4AV5veUCNsyuynpIl.mfYwRBoGtYHRmsiTdBtYuvRj6'),
  ('Juan',   'juan@test.com',   '$2b$10$Ek9VbZukyg4AV5veUCNsyuynpIl.mfYwRBoGtYHRmsiTdBtYuvRj6')
on conflict (mail) do update
  set password = excluded.password
  -- Only repair rows still holding a plain-text password; never overwrite real hashes.
  where public.usuarios.password not like '$2_$%';

-- Skip the rest if sample data was already loaded, so reruns do not duplicate rows.
do $$
begin
  if exists (
    select 1 from public.ahorros a
    join public.usuarios u on u.id = a."userId"
    where u.mail = 'marcos@test.com'
  ) then
    raise notice 'Sample data already present, skipping.';
    return;
  end if;

  insert into public.ahorros (name, quantity, description, type, date, "userId")
  select v.name, v.quantity, v.description, v.type, v.date::date, u.id
  from (values
    ('Emergency fund', 5000,   'Bank savings account', 'USD', '2026-01-10', 'marcos@test.com'),
    ('Vacation',       1200,   'Summer trip',          'USD', '2026-03-05', 'marcos@test.com'),
    ('Fixed deposit',  300000, '30-day term',          'ARS', '2026-06-01', 'lucia@test.com'),
    ('Cash',           800,    null,                   'EUR', null,         'juan@test.com')
  ) as v(name, quantity, description, type, date, mail)
  join public.usuarios u on u.mail = v.mail;

  insert into public.cripto (name, hold, platform, symbol, "purchaseDate", "userId")
  select v.name, v.hold, v.platform, v.symbol, v.pd::timestamp, u.id
  from (values
    ('Bitcoin',  0.0523, 'Binance', 'BTC',  '2025-11-15 10:00', 'marcos@test.com'),
    ('Ethereum', 1.25,   'Binance', 'ETH',  '2026-02-20 14:30', 'marcos@test.com'),
    ('Solana',   15,     'Kraken',  'SOL',  '2026-04-01 09:15', 'lucia@test.com'),
    ('Tether',   500,    'Lemon',   'USDT', '2026-05-10 18:00', 'juan@test.com')
  ) as v(name, hold, platform, symbol, pd, mail)
  join public.usuarios u on u.mail = v.mail;

  insert into public.deudas (name, amount, description, "userId")
  select v.name, v.amount, v.description, u.id
  from (values
    ('Credit card', 850.50, 'Visa monthly balance', 'marcos@test.com'),
    ('Car loan',    12000,  '36 installments',      'lucia@test.com'),
    ('Friend loan', 200,    'Owed to Pedro',        'juan@test.com')
  ) as v(name, amount, description, mail)
  join public.usuarios u on u.mail = v.mail;

  insert into public.inversiones (name, hold, platform, symbol, "purchaseDate", "userId")
  select v.name, v.hold, v.platform, v.symbol, v.pd::timestamp, u.id
  from (values
    ('Apple CEDEAR', 10, 'IOL',    'AAPL', '2025-12-01 11:00', 'marcos@test.com'),
    ('S&P 500 ETF',  5,  'IOL',    'SPY',  '2026-01-15 12:00', 'marcos@test.com'),
    ('YPF',          20, 'Balanz', 'YPF',  '2026-03-22 15:45', 'lucia@test.com'),
    ('MercadoLibre', 2,  'IOL',    'MELI', '2026-07-08 10:30', 'juan@test.com')
  ) as v(name, hold, platform, symbol, pd, mail)
  join public.usuarios u on u.mail = v.mail;
end $$;
