const { Sequelize, Model } = require('sequelize');
const { Product, ImagesProduct, Product_Category, Category, OptionsProduct } = require('../models/create_models');

exports.listarProdutos = async (req, res) => {
    try {
        const MAX_LIMIT = 1000;

        const { limit = 12, page = 1, fields, match, category_ids, price_range, options } = req.query;

        // Garantindo que o limit seja inteiro
        const queryLimit = limit ? parseInt(limit, 10) : 12;

        // Calculando o desvio
        var offset = page > 0 ? (queryLimit * (parseInt(page, 10)-1)) : undefined;

        // Tratamento do parâmetro fields
        const queryFields = fields ? fields.split(',') : ['id','name','price'];

        // match -> Não faço ideia de como tratar

        // Iniciando o where
        const where = {};

        // Garantindo que category_ids seja uma array e adicionando ao where
        if (category_ids) {
            const queryCategory_ids = category_ids.split(',');
            where['$Categories.id$'] = { [Sequelize.Op.in]: queryCategory_ids };
        };

        // Tratamento para o parâmetro options
        if (options) {
            const queryOptions = options.split(',');
            where['$OptionsProduct$'] = { [Sequelize.Op.contains]: options };
        };

        // Tratamento para o parâmetro price_range 
        if (price_range) {
            const [minPrice, maxPrice] = price_range.split('-').map(Number);
            where.price = {
                [Sequelize.Op.between]: [minPrice || 0, maxPrice || Number.MAX_VALUE]
            };
        };

        const { count, rows }= await Product.findAndCountAll({
            where: where,
            attributes: queryFields,
            include: [
                {
                    model: Category,
                    attributes: ['id']
                },
                {
                    model: ImagesProduct,
                    attributes: ['id', 'path'],
                },
                {
                    model: OptionsProduct,
                    attributes: ['id', 'title', 'shape', 'radius', 'type', 'values']
                }
            ],
            limit: queryLimit < 0 ? Number.MAX_LIMIT : queryLimit,
            offset: offset
        });

        const formattedProducts = rows.map(product => ({
            id: product.id,
            enabled: product.enabled,
            name: product.name,
            slug: product.slug,
            stock: product.stock,
            description: product.description,
            price: product.price,
            category_ids: product.Categories?.map(category => category.id),
            images: product.ImagesProduct?.map(image => ({ id: image.id, path: image.path })),
            options: product.OptionsProduct?.map(option => ({ id: option.id, title: option.title, shape: option.shape, radius: option.radius, type: option.type, values: option.values })),
        }));

        res.status(200).json({
            data: formattedProducts,
            total: count,
            limit: queryLimit,
            page: parseInt(page, 10),
        });
    } catch (error) {
        console.log('Erro ao listar produtos: ', error);
    }
};

exports.obterProduto = async (req, res) => {
    try {   
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).send("Produto não encontrado!");
        };

        res.status(200).json(product);
    } catch (error) {
        console.log('Erro ao obter produto: ', error);
    }
};

exports.criarProduto = async (req, res) => {
    try {
        const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.body;
        const newProduct = await Product.create({ 
            enabled, 
            name, 
            slug, 
            stock, 
            description, 
            price, 
            price_with_discount 
        });

        console.log('Produto criado: ' + newProduct.id)

        for (var i in images) {
            await ImagesProduct.create({ 
                path: images[i].content, 
                product_id: newProduct.id, 
                enabled: newProduct.enabled 
            });
        };
        
        for (var i in category_ids) {
            await Product_Category.create({ 
                product_id: newProduct.id, 
                category_id: category_ids[i] 
            });
        };

        for (var i in options) {

            if (options[i].radius){
                await OptionsProduct.create({ 
                    product_id: newProduct.id, 
                    title: options[i].title, 
                    shape: options[i].shape, 
                    radius: options[i].radius, 
                    type: options[i].type, 
                    values: JSON.stringify(options[i].values)
                });
            } else {
                await OptionsProduct.create({ 
                    product_id: newProduct.id, 
                    title: options[i].title, 
                    shape: options[i].shape, 
                    type: options[i].type, 
                    values: JSON.stringify(options[i].values) 
                });
            };
        };

        res.status(201).json(newProduct);
    } catch (error) {
        console.log('Erro ao criar produto: ', error);
    }
}

exports.atualizarProduto = async (req, res) => {
    const { enabled, name, slug, stock, description, price, price_with_discount, category_ids, images, options } = req.query;
}