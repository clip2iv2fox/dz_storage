const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { Reservation, Good, Item } = require('./models');

const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// продукция
app.get('/api/item', async (req, res) => {
    try {
        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка связи с бд' });
    }
});

app.post('/api/item', async (req, res) => {
    try {
        const { name, number } = req.body;

        const itemCopy = await Item.findOne({
            where: {
                name: name
            }
        });

        if (itemCopy) {
            return res.status(400).json({ error: 'Такой продукт уже на складе' });
        }

        Item.create({
            name: name || 'NaN',
            number: number || 0,
        });

        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка связи с бд' });
    }
});

// заказы
app.get('/api/reservation', async (req, res) => {
    try {
        const reservations = await Reservation.findAll({
            include: [{
                model: Good,
                as: 'goods',
            }],
        });

        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка связи с бд' });
    }
});

app.post('/api/reservation', async (req, res) => {
    try {
        const { firstName, secondName, fatherName, date } = req.body;

        Reservation.create({
            firstName: firstName,
            secondName: secondName,
            fatherName: fatherName,
            date: date,
        });

        const reservations = await Reservation.findAll({
            include: [{
                model: Good,
                as: 'goods',
            }],
        });
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка создания заказа' });
    }
});

app.put('/api/reservation/:reservationId', async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        const { firstName, secondName, fatherName, date }  = req.body;

        const reservation = await Reservation.findByPk(reservationId, {
            include: [{
                model: Good,
                as: 'goods',
            }],
        });

        await reservation.update({
            firstName: firstName,
            secondName: secondName,
            fatherName: fatherName,
            date: date
        });

        const reservations = await Reservation.findAll({
            include: [{
                model: Good,
                as: 'goods',
            }],
        });
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка изменения заказа' });
    }
});

app.delete('/api/reservation/:reservationId', async (req, res) => {
    try {
        const reservationId = req.params.reservationId;

        const reservationToDelete = await Reservation.findByPk(reservationId);

        if (!reservationToDelete) {
            return res.status(404).json({ error: 'Такого заказа нет' });
        }

        await reservationToDelete.destroy();

        const reservations = await Reservation.findAll({
            include: [{
                model: Good,
                as: 'goods',
            }],
        });
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления заказа' });
    }
});

// товары в заказе
app.post('/api/good/:reservationId', async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        const { name, number, itemId } = req.body;

        const reservation = await Reservation.findByPk(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Выбранного заказа нет' });
        }

        const item = await Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Выбранного товара нет' });
        }

        const goods = await Good.findAll({
            where: {
                itemId: itemId
            }
        })
        const goodsSum = (goods || []).reduce((sum, good) => {
            return sum + parseInt(good.number);
        }, 0);

        if ( goodsSum + parseInt(number) > parseInt(item.number) ) {
            return res.status(400).json({ error: `Недостаточно продукции на складе` });
        }

        Good.create({
            name: name,
            number: number,
            itemId: itemId,
            reservationId: reservationId,
        });

        const reservations = await Reservation.findAll({
            include: [{
                model: Good,
                as: 'goods',
            }],
        });
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка связи с бд' });
    }
});

app.put('/api/good/:goodId', async (req, res) => {
    try {
        const goodId = req.params.goodId;
        const { name, number, reservationId } = req.body;
        
        const goodOld = await Good.findByPk(goodId);
        if (!goodOld) {
            return res.status(404).json({ error: 'Выбранного товара' });
        }

        const reservation = await Reservation.findByPk(reservationId);
        if (!reservation) {
            return res.status(404).json({ error: 'Выбранного заказа нет' });
        }

        const item = await Item.findByPk(goodOld.itemId);
        if (!item) {
            return res.status(404).json({ error: 'Выбранного товара нет' });
        }

        const goods = await Good.findAll({
            where: {
                itemId: goodOld.itemId
            }
        })
        const goodsSum = (goods || []).reduce((sum, good) => {
            if (good.id !== goodId) {
                return sum + good.number;
            }
            return sum;
        }, 0);

        if ( goodsSum + parseInt(number) > parseInt(item.number) ) {
            return res.status(400).json({ error: `Недостаточно продукции на складе` });
        }

        await goodOld.update({
            name: name,
            number: number,
            reservationId: reservationId,
        });

        const reservations = await Reservation.findAll({
            include: [{
                model: Good,
                as: 'goods',
            }],
        });
        res.json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка изменения продукта' });
    }
});

app.delete('/api/good/:goodId', async (req, res) => {
    try {
        const goodId = req.params.goodId;
        const good = await Good.findByPk(goodId);
        if (!good) {
            return res.status(404).json({ error: 'Выбранного товара нет' });
        }

        await good.destroy()

        res.json({ message: 'Товар удалена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления товара' });
    }
});

app.delete('/api/day', async (req, res) => {
    try {
        const { date } = req.body;

        if (!date || isNaN(Date.parse(date))) {
            return res.status(400).json({ error: 'Неверный формат даты' });
        }

        const reservations = await Reservation.findAll({
            include: [{
                model: Good,
                as: 'goods',
            }],
            where: {
                date: {
                    [Op.lt]: new Date(date),
                },
            },
        });
        console.log(reservations)

        const items = await Item.findAll();

        for (const reservation of reservations) {
            for (const good of reservation.goods) {
                await minusItem(good.itemId, good.number);
            }
            await reservation.destroy();
        }

        for (const item of items) {
            await plusItem(item.id);
        }

        res.json({ message: 'День переведён' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка перевода дня' });
    }
});

const minusItem = async (id, number) => {
    const item = await Item.findByPk(id);

    await item.update({
        number: parseInt(item.number) - parseInt(number)
    })
}

const plusItem = async (id) => {
    const item = await Item.findByPk(id);

    const randomIncrement = Math.floor(Math.random() * 10) + 1;

    await item.update({
        number: parseInt(item.number) + randomIncrement,
    });
}

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});