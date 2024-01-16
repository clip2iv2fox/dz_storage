const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes, Op } = require('sequelize');

const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
});

// Определение моделей
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
    number: {
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
Plane.hasMany(Plane, {
    foreignKey: 'planeId',
    onDelete: 'CASCADE',
});
Flight.belongsTo(Plane, {
    foreignKey: 'planeId',
    onDelete: 'CASCADE',
});

Flight.hasMany(Flight, {
    foreignKey: 'flightId',
    onDelete: 'CASCADE',
});
Booking.belongsTo(Flight, {
    foreignKey: 'flightId',
    onDelete: 'CASCADE',
});

// Создать таблицы, если их нет
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

//////////////////////////////////////////////////////////////
// cамолёты
app.post('/api/plane', async (req, res) => {
    try {
        const { name, value } = req.body;
        Plane.create({
            name: name || 'неизвестен',
            value: value || 1,
        });
        
        const plane = await Plane.findAll();
        res.json(plane);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сохранения в базе данных' });
    }
});

app.get('/api/plane', async (req, res) => {
    try {
        const plane = await Plane.findAll();
        res.json(plane);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения данных из базы данных' });
    }
});

app.delete('/api/plane/:planeId', async (req, res) => {
    try {
        const planeId = req.params.planeId;
        const planeToDelete = await Plane.findByPk(planeId);
        if (!planeToDelete) {
            return res.status(404).json({ error: 'Самолёт не найден' });
        }

        await planeToDelete.destroy();

        const plane = await Plane.findAll();
        res.json(plane);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления самолёта' });
    }
});

// рейсы
app.get('/api/flight', async (req, res) => {
    try {
        const flights = await Flight.findAll();
        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения рейсов' });
    }
});

app.post('/api/flight', async (req, res) => {
    try {
        const { number, date, target, planeId } = req.body;

        const plane = await Plane.findByPk(planeId);

        if (!plane) {
            return res.status(404).json({ error: 'Выбранный самолёт не найден' });
        }

        const existingFlight = await Flight.findOne({
            where: {
                date: date,
                target: target,
            },
        });

        if (existingFlight) {
            return res.status(400).json({ error: 'Рейс с такой датой вылета или пунктом назначения уже существует' });
        }

        Flight.create({
            number: number,
            date: date,
            target: target,
            planeId: planeId,
        });

        const flights = await Flight.findAll();
        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка создания рейса' });
    }
});

app.put('/api/flight/flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;
        const { number, date, target, planeId } = req.body;

        const plane = await Plane.findByPk(planeId);

        if (!plane) {
            return res.status(404).json({ error: 'Выбранный самолёт не найден' });
        }

        const existingFlight = await Flight.findOne({
            where: {
                date: date,
                target: target,
            },
        });

        if (existingFlight) {
            return res.status(400).json({ error: 'Рейс с такой датой вылета или пунктом назначения уже существует' });
        }

        const flight = await Flight.findByPk(flightId);

        await flight.update({
            number: number,
            date: date,
            target: target,
            planeId: planeId,
        });

        const flights = await Flight.findAll();
        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка изменения рейса' });
    }
});

app.delete('/api/flight/:flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;

        const flightToDelete = await Flight.findByPk(flightId, {
            include: [{
                model: Booking,
                as: 'bookings',
            }],
        });

        if (!flightToDelete) {
            return res.status(404).json({ error: 'Рейс не найден' });
        }

        if (flightToDelete.bookings && flightToDelete.bookings.length > 0) {
            await Booking.destroy({
                where: {
                    id: flightToDelete.bookings.map(booking => booking.id),
                },
            });
        }

        await flightToDelete.destroy();

        const flights = await Flight.findAll();
        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления рейса' });
    }
});

// брони
app.post('/api/booking/:flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;
        const { name } = req.body;

        if (!name) {
            return res.status(404).json({ error: 'Не введено ФИО' });
        }

        const flight = await Flight.findByPk(flightId);

        if (!flight) {
            return res.status(404).json({ error: 'Выбранный рейс не найден' });
        }

        const bookedSeats = await Booking.count({
            where: {
                flightId: flightId,
            },
        });

        if (bookedSeats >= flight.number) {
            return res.status(400).json({ error: 'На рейсе нет свободных мест' });
        }

        const existingBooking = await Booking.findOne({
            where: {
                name: name,
            },
        });

        if (existingBooking) {
            return res.status(400).json({ error: 'Бронь с данными ФИО уже существует' });
        }

        Booking.create({
            name: name,
            flightId: flightId,
        });
        
        const bookings = await Booking.findAll({
            where: {
                flightId: flightId,
            },
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сохранения в базе данных' });
    }
});

app.put('/api/booking/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { name, flightId } = req.body;

        const flight = await Flight.findByPk(flightId);

        if (!flight) {
            return res.status(404).json({ error: 'Выбранный рейс не найден' });
        }

        const bookedSeats = await Booking.count({
            where: {
                flightId: flightId,
                id: { [Op.ne]: bookingId }, // Exclude the current booking when counting
            },
        });

        if (bookedSeats >= flight.number) {
            return res.status(400).json({ error: 'На рейсе нет свободных мест' });
        }

        const existingBooking = await Booking.findOne({
            where: {
                name: name,
            },
        });

        if (existingBooking) {
            return res.status(400).json({ error: 'Бронь с данными ФИО уже существует' });
        }

        const booking = await Booking.findByPk(bookingId);

        const oldFlight = await Flight.findByPk(booking.flightId);

        if (oldFlight.target !== flight.target) {
            return res.status(400).json({ error: 'Пункт назначения должен совпадать со старым' });
        }

        await booking.update({
            name: name,
            flightId: flightId,
        });

        res.json({ message: 'Бронь успешно изменена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка изменения рейса' });
    }
});


app.get('/api/booking/:flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;

        const bookings = await Booking.findAll({
            where: {
                flightId: flightId,
            },
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения данных из базы данных' });
    }
});

app.delete('/api/booking/:bookingId', async (req, res) => {
    try {
        const bookingId = req.params.bookingId;

        const bookingToDelete = await Booking.findByPk(bookingId);
        if (!bookingToDelete) {
            return res.status(404).json({ error: 'Бронь не найдена' });
        }

        const flightId = bookingToDelete.flightId

        await bookingToDelete.destroy();

        const bookings = await Booking.findAll({
            where: {
                flightId: flightId,
            },
        });
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления брони' });
    }
});

app.listen(port, () => {
    initializePlanes();
    console.log(`Сервер запущен на порту ${port}`);
});