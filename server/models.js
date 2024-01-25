const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    secondName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fatherName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Item = sequelize.define('item', {
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Определение ассоциаций
Order.hasMany(Product, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
});
Product.belongsTo(Order, {
    foreignKey: 'orderId',
    onDelete: 'CASCADE',
});

Item.hasMany(Product, {
    foreignKey: 'itemId',
});
Product.belongsTo(Item, {
    foreignKey: 'itemId',
});

sequelize.sync();

module.exports = { Order, Product, Item };
