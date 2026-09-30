import express from 'express';
import cors from 'cors';
import profileRoutes from './profile.routes';
import { projectRoutes } from './project.routes';
// importe suas outras rotas se houver
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

// Registrar rotas
app.use('/api', profileRoutes);
app.use('/api', projectRoutes);

// Middleware global de tratamento de erros (DEVE SER O ÚLTIMO app.use)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});