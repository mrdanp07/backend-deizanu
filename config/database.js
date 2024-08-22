const { Sequelize, DataTypes } = require('sequelize');
// const dbPassword = process.env.DB_PASSWORD;

// console.log(process.env.URI)

const sequelize = new Sequelize(process.env.URI, {
    logging: false
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Conectado com o banco de dados!");
    } catch (error) {
        console.error("Erro ao conectar com o banco de dados:", error);
    }
})();

module.exports = { sequelize };