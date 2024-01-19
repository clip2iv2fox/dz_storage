const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const Plane = sequelize.define('plane', {
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
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Flight = sequelize.define('flight', {
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
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    target: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

const Booking = sequelize.define('booking', {
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
});

// Определение ассоциаций
Plane.hasMany(Flight, {
    foreignKey: 'planeId',
    onDelete: 'CASCADE',
});
Flight.belongsTo(Plane, {
    foreignKey: 'planeId',
    onDelete: 'CASCADE',
});

Flight.hasMany(Booking, {
    foreignKey: 'flightId',
    as: 'bookings',
    onDelete: 'CASCADE',
});
Booking.belongsTo(Flight, {
    foreignKey: 'flightId',
    as: 'flight',
    onDelete: 'CASCADE',
});

Plane.sync();
Flight.sync();
Booking.sync();

const initializePlanes = async () => {
    try {
        const existingPlanes = await Plane.findAll();

        if (existingPlanes.length === 0) {
            const planesData = [
                { name: 'Boeing 747', value: 300 },
                { name: 'Airbus A320', value: 150 },
            ];

            await Plane.bulkCreate(planesData);
        }
    } catch (error) {
        console.error('Ошибка при инициализации самолётов:', error);
    }
};

initializePlanes();

module.exports = { Plane, Flight, Booking };
