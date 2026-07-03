const fs = require('fs');
const { Client } = require('pg');

// Conectando ao banco de dados com a senha URL-encoded (o @ vira %40)
const client = new Client({
  connectionString: 'postgresql://postgres:Atlas2026Empresa%40@db.jkernhtvpwrzitirffwy.supabase.co:5432/postgres'
});

async function runMigration() {
  try {
    console.log('Conectando ao Supabase...');
    await client.connect();
    console.log('Conectado com sucesso!');
    
    console.log('Lendo db_schema.sql...');
    const sql = fs.readFileSync('db_schema.sql', 'utf8');
    
    console.log('Executando as queries (criando tabelas e inserindo dados mockados)...');
    await client.query(sql);
    
    console.log('Migração concluída com sucesso! Banco de dados pronto.');
  } catch (err) {
    console.error('Erro durante a migração:', err);
  } finally {
    await client.end();
  }
}

runMigration();
