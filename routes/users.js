const express = require('express');
const router = express.Router();
const { User } = require('../models/create_models');

router.get('/', async (req, res) => {
    try {
        const users = await User.findAll({
            order: [['id', 'ASC']]
        });
        res.json(users);
    } catch (error) {
        console.log('Erro ao acessar usuários: ', error);
    }
});

router.post('/', async (req, res) => {
    try {
        const {firstname, surname, email, password} = req.body;
        const newUser = await User.create({ firstname, surname, email, password });
        res.status(201).json(newUser);
    } catch (error) {
        console.log('Erro ao criar usuário: ', error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        };

        res.json(user);
    } catch (error) {
        console.log('Erro ao encontrar o usuário pelo id: ', error);
    }
});

router.put('/:id', async (req, res) => {
    try {''
        const { firstname, surname, email, password } = req.body;
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        };

        if (firstname) user.firstname = firstname;
        if (surname) user.surname = surname;
        if (email) user.email = email;
        if (password) user.password = password;

        await user.save();
        res.json(user);
    } catch (error) {
        console.log("Erro ao atualizar usuário: ", error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        };

        await user.destroy();
        res.json(user);
    } catch (error) {
        console.log("Erro ao excluir usuário: ", error);
    }
});

module.exports = router;