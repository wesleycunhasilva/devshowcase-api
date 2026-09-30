import Database from 'better-sqlite3';

export const db = new Database('devshowcase.db');

// Habilita Chaves Estrangeiras
db.pragma('foreign_keys = ON');

// Inicialização das Tabelas
db.exec(`
  CREATE TABLE IF NOT EXISTS Profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    bio TEXT
  );

  CREATE TABLE IF NOT EXISTS Technology (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS Project (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    repositoryUrl TEXT NOT NULL,
    profileId INTEGER NOT NULL,
    FOREIGN KEY (profileId) REFERENCES Profile(id) ON DELETE CASCADE
  );

  -- Entidade Feedback (Project 1 : N Feedback)
  CREATE TABLE IF NOT EXISTS Feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL,
    projectId INTEGER NOT NULL,
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE
  );

  -- Tabela Intermediária (Project N : N Technology)
  CREATE TABLE IF NOT EXISTS ProjectTechnology (
    projectId INTEGER NOT NULL,
    technologyId INTEGER NOT NULL,
    PRIMARY KEY (projectId, technologyId),
    FOREIGN KEY (projectId) REFERENCES Project(id) ON DELETE CASCADE,
    FOREIGN KEY (technologyId) REFERENCES Technology(id) ON DELETE CASCADE
  );
`);

console.log('📦 Conectado ao banco de dados SQLite com sucesso.');