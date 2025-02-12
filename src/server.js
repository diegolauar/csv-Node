import express from 'express';
import { csvRoutes } from './routes/csvRoutes.js';

const app = express();
const PORT = 3333;

app.use(express.json());
app.use('/', csvRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
