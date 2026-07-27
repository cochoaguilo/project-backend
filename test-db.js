import mysql from 'mysql2/promise';

async function test() {
  try {
    const connection = await mysql.createConnection({
      host: 'database-central.ch8260q6kda5.sa-east-1.rds.amazonaws.com',
      port: 3306,
      user: 'adminMarcos',
      password: '28011644Ma!',
      database: 'wallet',
      ssl: {
        rejectUnauthorized: false,
      },
    });

    console.log('✅ Conectado');
    await connection.end();
  } catch (err) {
    console.error(err);
  }
}

test();