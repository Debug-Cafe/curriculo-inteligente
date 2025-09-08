import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth';
import { resumesRouter } from './routes/resumes';
import { aiRouter } from './routes/aiRoutes';
import { usersRouter } from './routes/users';
import { initDatabase } from './database/database';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

// Inicializar banco de dados
initDatabase();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', authRouter);
app.use('/api/resumes', resumesRouter);
app.use('/api/users', usersRouter);
app.use('/api/ai', aiRouter); // <<< ESTA É A LINHA QUE FOI ADICIONADA

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Middleware de tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Health check disponível em: http://localhost:${PORT}/health` );
});

