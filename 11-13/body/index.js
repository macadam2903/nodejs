import express from 'express';
const app = express();
app.use(express.json({extended: true}));
app.post('/user', (req, res) => {
    //let name = req.body.name;
    //let age = req.body.age;
    let { name, age } = req.body;
    res.send(`User name is: ${name} and age is: ${age}`);
}   );
app.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});