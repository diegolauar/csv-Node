import fs from 'fs';
import path from 'path';

const JSON_DIR = path.join(process.cwd(), './src/database'); // Pasta onde os JSONs serão salvos

// Certifique-se de que a pasta "json" existe
if (!fs.existsSync(JSON_DIR)) {
    fs.mkdirSync(JSON_DIR);
}

export const saveJson = (filename, newData) => {
    const filePath = path.join(JSON_DIR, filename);

    let existingData = [];

    // Se o arquivo já existir, carregar os dados existentes
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        existingData = JSON.parse(fileContent);
    }

    // Adicionar os novos dados
    const updatedData = [...existingData, ...newData];

    // Salvar no arquivo JSON
    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2), 'utf-8');

    return updatedData;
};
