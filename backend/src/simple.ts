import express from 'express';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);

console.log('🔧 PORT do Railway:', process.env.PORT);
console.log('🔧 PORT que será usada:', PORT);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend funcionando!', port: PORT });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), port: PORT });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🌍 Escutando em 0.0.0.0:${PORT}`);
});