const { sequelize } = require('../config/database');
const { Model, DataTypes } = require('sequelize');

class Category extends Model { };
class User extends Model { };
class Product extends Model { };
class ImagesProduct extends Model { };
class OptionsProduct extends Model { };
class Product_Category extends Model { };

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: DataTypes.STRING,
        surname: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING,
    },
    {
        sequelize,
        modelName: 'User'
    }
);

Category.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        use_in_menu: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: 'Category',
    }
);

Product.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false
        },
        use_in_menu: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        stock: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        description: {
            type: DataTypes.STRING,
            defaultValue: ""
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        price_with_discount: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Product',
    }
);

ImagesProduct.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: 'id'
            },
            allowNull: false
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'ImagesProduct'
    }
);

OptionsProduct.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        product_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Product,
                key: 'id'
            }
        },
        title: {
            type: DataTypes.STRING, 
            allowNull: false
        },
        shape: {
            type: DataTypes.ENUM('square', 'circle'),
            defaultValue: 'square'
        },
        radius: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        type: {
            type: DataTypes.ENUM('text', 'color'),
            defaultValue: 'text'
        },
        values: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'OptionsProduct'
    }
);

Product_Category.init(
    {
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Product',
                key: 'id'
            },
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Category',
                key: 'id',
            }
        }
    },
    {
        sequelize,
        modelName: 'Product_Category',
        tableName: 'Product_Category'
    }
);

Product.hasMany(ImagesProduct, { foreignKey: 'product_id' });
ImagesProduct.belongsTo(Product, { foreignKey: 'product_id' });

Product.hasMany(OptionsProduct, { foreignKey: 'product_id' });
OptionsProduct.belongsTo(Product, { foreignKey: 'product_id' });

// Relação entre Product e Category através de Product_Category
Product.belongsToMany(Category, {
    through: Product_Category,
    foreignKey: 'product_id',
    otherKey: 'category_id',
});

Category.belongsToMany(Product, {
    through: Product_Category,
    foreignKey: 'category_id',
    otherKey: 'product_id'
});

(async () => {
    try {
        await sequelize.sync({ force: true });
        console.log("Modelos sincronizados!");
    } catch (error) {
        console.error('Erro na sincronização:', error);
    }
})();

module.exports = { User, Category, Product, ImagesProduct, OptionsProduct, Product_Category };