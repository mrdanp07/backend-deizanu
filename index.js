require('dotenv').config()

const { sequelize } = require('./config/database');
const { app } = require('./server/server');
const { categories } = require('./models/create_models');