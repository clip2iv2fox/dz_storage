const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

const Exercize = sequelize.define('exercize', {
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
    difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Workout = sequelize.define('workout', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

const Practice = sequelize.define('practice', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    time: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

// Определение ассоциаций
Workout.hasMany(Practice, {
    foreignKey: 'workoutId',
    onDelete: 'CASCADE',
});
Practice.belongsTo(Workout, {
    foreignKey: 'workoutId',
    onDelete: 'CASCADE',
});


const initializeDatabase = async () => {
    try {
        await sequelize.sync();

        const existingExercizes = await Exercize.findAll();

        if (existingExercizes.length === 0) {
            const exercizeData = [
                { name: 'Подъём штанги стоя', difficulty: 8 },
                { name: 'Приседания', difficulty: 6 },
            ];

            await Exercize.bulkCreate(exercizeData);
        }
    } catch (error) {
        console.error('Ошибка при инициализации базы данных:', error);
    }
};

initializeDatabase();

module.exports = { Plane, Flight, Booking };
