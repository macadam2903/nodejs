import express from 'express'; 
import fs from 'fs'; 
import path from 'path'; 
import { fileURLToPath } from 'url'; 
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:hetnapja', (req, res) => {
    const hetnapja = req.params.hetnapja.toLowerCase();
    const filePath = path.join(__dirname, 'public', `${hetnapja}.html`);
console.log(`kérés érkezett a következp napra: ${hetnapja}`);

    try {
        if (fs.existsSync(filePath)) {
            res.status(201).sendFile(filePath);
        } else { 
            res.status(404).send('<h1>A kért oldal nem található.');
        }
    } catch (err) {
        res.status(500).send('<h1>Hiba történt a szerveren.');
    }
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
