import express from 'express';

const app = express();

// Habilita recebimento de JSON no body das requisições
app.use(express.json());

// Rota 1: Perfis
app.get('/api/profiles', (req, res) => {
  return res.json([{ id: 1, name: "Roger Cardoso" }]);
});

// Rota 2: Tecnologias
app.post('/api/technologies', (req, res) => {
  const { name } = req.body;
  return res.status(201).json({ id: 1, name: name || "TypeScript" });
});

// Rota 3: Projetos
app.post('/api/projects', (req, res) => {
  const { title, description } = req.body;
  return res.status(201).json({ id: 1, title: title || "DevShowcase API", description });
});

// Inicialização do servidor na porta 3333 para evitar conflitos com a porta 3000
const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Servidor rodando com sucesso na porta ${PORT} 🚀`);
});