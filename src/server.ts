import express from 'express';
import projectRoutes from './project.routes';
import profileRoutes from './profile.routes';
import technologyRoutes from './technology.routes';

const app = express();

app.use(express.json());

// Registra as rotas sob o prefixo /api
app.use('/api', projectRoutes);
app.use('/api', profileRoutes);
app.use('/api', technologyRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});