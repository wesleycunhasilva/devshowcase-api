import express, { Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import projectRoutes from './project.routes';
import profileRoutes from './profile.routes';
import technologyRoutes from './technology.routes';
import swaggerDocument from './swagger.json';

const app = express();

app.use(express.json());

// Documentação Swagger
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rotas da API
app.use('/api', projectRoutes);
app.use('/api', profileRoutes);
app.use('/api', technologyRoutes);

// Handler para Rota Não Encontrada (404 Global)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
    message: `A rota ${req.method} ${req.originalUrl} não foi encontrada no servidor.`,
  });
});

// Middleware Global de Tratamento de Erros (400 / 500)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro capturado pelo Handler Global:', err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Erro interno no servidor.';

  res.status(statusCode).json({
    status: statusCode,
    error: statusCode === 400 ? 'Bad Request' : 'Internal Server Error',
    message,
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação Swagger disponível em /api/docs`);
});