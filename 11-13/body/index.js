import express from 'express';
const app = express();
app.use(express.json({extended: true}));
app.post('/user', (req, res) => {
    //let name = req.body.name;
    //let age = req.body.age;
    let { name, age } = req.body;
    res.send(`User name is: ${name} and age is: ${age}`);
}   );