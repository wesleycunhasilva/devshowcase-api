import sqlite3 from 'sqlite3';

export const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados', err.message);
  } else {
    console.log('📦 Conectado ao banco de dados SQLite com sucesso.');
  }
});

// Criar tabelas básicas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS Profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    bio TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Technology (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS Project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    repositoryUrl TEXT NOT NULL,
    profileId INTEGER
  )`);
});