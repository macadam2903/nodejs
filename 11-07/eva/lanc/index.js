import express from 'express';
const app = express();
const valasz =[""];
app.use((req, res, next) => {valasz.push("middleware első"); next();});
app.use((req, res, next) => {valasz.push("middleware második"); next();});
app.get('/', (req, res) => {valasz.push("GET/kezelő");
    res.status(200).send(valasz.join('\n'));});

app.listen(3000, () => {
  console.log('EVA Lanc Server is running on http://localhost:3000');
});
