const express = require('express');
const router = express.Router();
const { Category } = require('../models/create_models');
const categoryConstrollers = require('../controllers/categoryControllers');

router.get('/search', categoryConstrollers.buscarCategorias);

router.post('/', categoryConstrollers.criarCategoria);

router.get('/:id', categoryConstrollers.buscarCategoria);

router.put('/:id', categoryConstrollers.atualizarCategoria);

router.delete('/:id', categoryConstrollers.deletarCategoria);

module.exports = router;