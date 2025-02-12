import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { parse } from 'csv-parse';
import { saveJson } from '../utils/banco.js';
import path from 'path';

const router = express.Router();
const JSON_DIR = path.join(process.cwd(), './src/database');

// Configuração do Multer para upload
const upload = multer({ dest: 'uploads/' });

router.post('/task', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado!' });
    }

    const filePath = req.file.path;
    const jsonFileName = req.file.originalname.replace('.csv', '.json'); // Nome do JSON baseado no CSV
    const results = [];

    // Ler e processar o CSV
    fs.createReadStream(filePath)
        .pipe(parse({ columns: true, delimiter: ',' }))
        .on('data', (row) => {
            results.push(row);
        })
        .on('end', () => {
            fs.unlinkSync(filePath); // Remover o CSV temporário
            const updatedData = saveJson(jsonFileName, results); // Salvar os dados no JSON

            res.json({ message: 'Arquivo processado e salvo com sucesso!', data: updatedData });
        })
        .on('error', (err) => {
            res.status(500).json({ error: 'Erro ao processar CSV', details: err.message });
        });
});

router.get('/task', (req, res) => {
    const filename = '/dados.json';
    const filePath = path.join(JSON_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo JSON não encontrado!' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);

    res.json({ message: 'Dados carregados com sucesso!', data: jsonData });
});

router.get('/task/:id', (req, res) => {
    const filename = '/dados.json';
    const filePath = path.join(JSON_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo JSON não encontrado!' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileContent);
    const result = jsonData.filter((e) => e.id == req.params.id)

    if (result.length == 0) {
        return res.status(400).json({ error: 'Nenhum id encontrado!' });
    }


    res.json({ message: 'Dados carregados com sucesso!', data: result });
});

router.put('/task/:id', (req, res) => {

    const { id } = req.params;
    const novosDados = req.body;

    if (!req.body.title && !req.body.description) {
        return res.status(404).json({ error: 'Nenhum dado para atualizar!' });
    }

    const filename = '/dados.json';
    const filePath = path.join(JSON_DIR, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo JSON não encontrado!' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    let task = JSON.parse(fileContent);
    let taskAtualizada
    // Atualiza a task do usuário
    task = task.map(task => {
        if (task.id === id) {
            taskAtualizada = { ...task, ...novosDados };
            return taskAtualizada;
        }
        return task;
    });

    if (!taskAtualizada) {
        return res.status(404).json({ error: 'Task não encontrado' });
    }

    fs.writeFile(filePath, JSON.stringify(task, null, 2), 'utf-8', (err) => {
        if (err) return res.status(500).json({ error: 'Erro ao salvar o arquivo' });
        res.json({ message: 'Idade atualizada com sucesso!', data: taskAtualizada });
    });

});




export { router as csvRoutes };
