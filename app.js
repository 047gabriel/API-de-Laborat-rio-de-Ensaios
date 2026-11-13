import 'dotenv/config';
import express from 'express';
import { pathToFileURL } from 'node:url';
import analistaRoutes from './routes/analistaRoutes.js';
import ensaioRoutes from './routes/ensaioRoutes.js';
import equipamentoRoutes from './routes/equipamentoRoutes.js';

export const app = express();

app.use(express.json());
app.use('/ensaio', ensaioRoutes);
app.use('/equipamento', equipamentoRoutes);
app.use('/analista', analistaRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: 'Rota não encontrada.' });
});

app.use((erro, _req, res, _next) => {
  if (erro instanceof SyntaxError && erro.status === 400 && 'body' in erro) {
    return res.status(400).json({ message: 'O corpo da requisição contém JSON inválido.' });
  }

  console.error('Erro não tratado na aplicação:', erro);
  return res.status(500).json({ message: 'Erro inesperado no servidor.' });
});

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const porta = Number(process.env.PORT || 3001);
  app.listen(porta, () => {
    console.log(`API disponível em http://localhost:${porta}`);
  });
}
