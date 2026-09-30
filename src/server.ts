import express from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();

app.use(cors());
app.use(express.json());

// Registra as rotas na aplicação
app.use(routes);

app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});
import feedbackRoutes from './feedback.routes'; // Ajuste o caminho se necessário

// Logo abaixo das outras rotas, adicione:
app.use('/api', feedbackRoutes);