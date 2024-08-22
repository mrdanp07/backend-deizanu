const express = require('express');
const PORT = 10000;
const app = express();
const users = require('../routes/users');
const categories = require('../routes/categoryRoutes');
const bodyParser = require('body-parser');
const products = require('../routes/productRoutes');

app.use(bodyParser.json());

app.use('/v1/user', users);
app.use('/v1/category', categories);
app.use('/v1/product', products);

app.get('/', (req, res) => {
    res.send('Olá, Mundo!');
});

app.listen(PORT, () => {
    console.log('Servidor rodando em: http://localhost:' + PORT)
})

module.exports = { app };