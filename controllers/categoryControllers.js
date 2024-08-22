const { Category }  = require('../models/create_models');

exports.buscarCategorias = async (req, res) => {
    try {
        const { limit = 12, page = 1, fields = 'name,slug', use_in_menu } = req.query;
    
        // Garantindo que o limite seja inteiro
        var queryLimit = parseInt(limit, 10);

        // Calculando o desvio para a página
        const offset = queryLimit > 0  && page > 0 ? ((parseInt(page, 10)-1) * queryLimit) : undefined;
        
        // Convertendo os campos para uma lista
        const attributes = fields.split(',');

        // Colocando a condição de use_in_menu em um objeto
        const where = {};
        if (use_in_menu==true) {
            where.use_in_menu = true;
        };

        // Realizando consulta
        const categories = await Category.findAll({
            where: where,
            attributes: attributes,
            limit: queryLimit === -1 ? undefined : queryLimit,
            offset: offset,
        });

        // Dando retorno
        res.status(200).json(categories);

    } catch (error) {
        console.log('Erro ao buscar categorias: ', error);
        res.status(400).send('Dados de requisição incorretos')
    }
};

exports.criarCategoria = async (req, res) => {
    try {
        const { name, slug, use_in_menu } = req.body;
        const category = await Category.create({ name, slug, use_in_menu });
        res.status(201).json(category);
    } catch (error) {
        console.log('Erro ao criar categoria: ', error);
    }
};

exports.buscarCategoria = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).send("Categoria não encontrada!");
        };

        res.status(200).json(category);
    } catch (error) {
        console.log('Erro ao buscar categoria: ', error);
    }
};

exports.atualizarCategoria = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).send("Categoria não encontrada!");
        };

        const { name, slug, use_in_menu } = req.body;

        if (name) category.name = name;
        if (slug) category.slug = slug;
        if (use_in_menu) category.use_in_menu = use_in_menu;

        await category.save();
        res.status(204);
    } catch (error) {
        console.log('Erro ao atualizar categoria: ', error);
    }
};

exports.deletarCategoria = async (req, res) => {
    try {
        const category = await Category.findByPk(req.params.id);

        if (!category) {
            return res.status(404).send("Categoria não encontrada!");
        };

        category.destroy();
        res.status(204);
    } catch (error) {
        console.log('Erro ao deletar categoria: ', error);
    }
};