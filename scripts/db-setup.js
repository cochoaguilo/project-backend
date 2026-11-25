// Applies supabase/schema.sql and supabase/seed.sql using the DB_* values in .env.
// Usage: npm run db:setup
const { readFileSync } = require('fs');
const path = require('path');
const { Client } = require('pg');

const required = ['DB_HOST', 'DB_USERNAME', 'DB_PASSWORD'];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`Missing in .env: ${missing.join(', ')}`);
  process.exit(1);
}

const sql = (file) =>
  readFileSync(path.join(__dirname, '..', 'supabase', file), 'utf8');

async function main() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'postgres',
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    for (const file of ['schema.sql', 'seed.sql']) {
      await client.query(sql(file));
      console.log(`Applied ${file}`);
    }
    const { rows } = await client.query(`
      select 'usuarios' as table, count(*)::int as rows from public.usuarios
      union all select 'ahorros', count(*)::int from public.ahorros
      union all select 'cripto', count(*)::int from public.cripto
      union all select 'deudas', count(*)::int from public.deudas
      union all select 'inversiones', count(*)::int from public.inversiones`);
    console.table(rows);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
