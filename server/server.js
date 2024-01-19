const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { Plane, Flight, Booking } = require('./models');

const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

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
        const flights = await Flight.findAll({
            include: [{
                model: Booking,
                as: 'bookings',
            }],
        });

        res.json(flights);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения рейсов' });
    }
});

app.post('/api/flight', async (req, res) => {
    try {
        const { name, date, target, planeId } = req.body;

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
            name: name,
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

app.put('/api/flight/:flightId', async (req, res) => {
    try {
        const flightId = req.params.flightId;
        const { name, date, target, planeId } = req.body;

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
            name: name || flight.name,
            date: date || flight.date,
            target: target || flight.target,
            planeId: planeId || flight.planeId,
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

        const flightToDelete = await Flight.findByPk(flightId);

        if (!flightToDelete) {
            return res.status(404).json({ error: 'Рейс не найден' });
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

        const plane = await Plane.findByPk(flight.planeId);

        if (!plane) {
            return res.status(404).json({ error: 'Самолет не найден' });
        }

        if (bookedSeats >= plane.value) {
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

        const existingBooking = await Booking.findOne({
            where: {
                name: name,
                id: { [Op.ne]: bookingId },
            },
        });

        if (existingBooking) {
            return res.status(400).json({ error: 'Бронь с данными ФИО уже существует' });
        }

        const plane = await Plane.findByPk(flight.planeId);

        const bookedSeats = await Booking.count({
            where: {
                flightId: flightId,
            },
        });
        if (bookedSeats >= plane.value) {
            return res.status(400).json({ error: 'На рейсе нет свободных мест' });
        }

        const booking = await Booking.findByPk(bookingId);

        if (flightId != booking.flightId) {
            const bookedSeats = await Booking.count({
                where: {
                    flightId: flightId,
                },
            });
            if (bookedSeats >= flight.value) {
                return res.status(400).json({ error: 'На рейсе нет свободных мест' });
            }
        }

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

        await bookingToDelete.destroy();
        res.json({ message: 'Бронь успешно удалена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления брони' });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});