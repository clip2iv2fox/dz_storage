const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const Reservation = sequelize.define('reservation', {
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

const Good = sequelize.define('good', {
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
Reservation.hasMany(Good, {
    foreignKey: 'reservationId',
    onDelete: 'CASCADE',
});
Good.belongsTo(Reservation, {
    foreignKey: 'reservationId',
    onDelete: 'CASCADE',
});

Item.hasMany(Good, {
    foreignKey: 'itemId',
});
Good.belongsTo(Item, {
    foreignKey: 'itemId',
});

const initializeDatabase = async () => {
    try {
        await sequelize.sync();

        const existingItems = await Item.findAll();

        if (existingItems.length === 0) {
            const itemData = [
                { name: 'Машинка игровая', number: 5 },
                { name: 'Телефон', number: 1 },
                { name: 'Вертолётик', number: 3 },
            ];

            await Item.bulkCreate(itemData);
        }
    } catch (error) {
        console.error('Ошибка при создании бд:', error);
    }
};

initializeDatabase();

module.exports = { Reservation, Good, Item };
