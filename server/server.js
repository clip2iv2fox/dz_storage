const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { Order, Product, Item } = require('./models');

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
        res.status(500).json({ error: 'Ошибка получения данных' });
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
            return res.status(400).json({ error: 'Такой продукт уже есть' });
        }

        Item.create({
            name: name || 'неизвестен',
            number: number || 1,
        });

        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сохранения в базе данных' });
    }
});

app.delete('/api/item/:itemId', async (req, res) => {
    try {
        const itemId = req.params.itemId;

        const itemToDelete = await Item.findByPk(itemId);
        if (!itemToDelete) {
            return res.status(404).json({ error: 'Продукт не найден' });
        }

        await itemToDelete.destroy();

        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления продукта' });
    }
});

// заказы
app.get('/api/order', async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [{
                model: Product,
                as: 'products',
            }],
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения заказов' });
    }
});

app.post('/api/order', async (req, res) => {
    try {
        const { firstName, secondName, fatherName, date } = req.body;

        Order.create({
            firstName: firstName,
            secondName: secondName,
            fatherName: fatherName,
            date: date,
        });

        const orders = await Order.findAll({
            include: [{
                model: Product,
                as: 'products',
            }],
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка создания заказа' });
    }
});

app.put('/api/order/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { firstName, secondName, fatherName, date }  = req.body;

        const order = await Order.findByPk(orderId, {
            include: [{
                model: Product,
                as: 'products',
            }],
        });

        await order.update({
            firstName: firstName,
            secondName: secondName,
            fatherName: fatherName,
            date: date
        });

        const orders = await Order.findAll({
            include: [{
                model: Product,
                as: 'products',
            }],
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка изменения заказа' });
    }
});

app.delete('/api/order/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const orderToDelete = await Order.findByPk(orderId);

        if (!orderToDelete) {
            return res.status(404).json({ error: 'Заказ не найден' });
        }

        await orderToDelete.destroy();

        const orders = await Order.findAll({
            include: [{
                model: Product,
                as: 'products',
            }],
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления заказа' });
    }
});

// товары в заказе
app.post('/api/product/:orderId', async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { name, number, itemId } = req.body;

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Выбранный заказ не найден' });
        }

        const item = await Item.findByPk(itemId);
        if (!item) {
            return res.status(404).json({ error: 'Выбранный товар не найден' });
        }

        const products = await Product.findAll({
            where: {
                itemId: itemId
            }
        })
        const productsSum = (products || []).reduce((sum, product) => {
            return sum + parseInt(product.number);
        }, 0);

        if ( productsSum + parseInt(number) > parseInt(item.number) ) {
            return res.status(400).json({ error: `Параллельный импорт не справился(((` });
        }

        Product.create({
            name: name,
            number: number,
            itemId: itemId,
            orderId: orderId,
        });

        const orders = await Order.findAll({
            include: [{
                model: Product,
                as: 'products',
            }],
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сохранения в базе данных' });
    }
});

app.put('/api/product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const { name, number, orderId } = req.body;
        
        const productOld = await Product.findByPk(productId);
        if (!productOld) {
            return res.status(404).json({ error: 'Выбранный товар не найден' });
        }

        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ error: 'Выбранный заказ не найден' });
        }

        const item = await Item.findByPk(productOld.itemId);
        if (!item) {
            return res.status(404).json({ error: 'Выбранный товар не найден' });
        }

        const products = await Product.findAll({
            where: {
                itemId: productOld.itemId
            }
        })
        const productsSum = (products || []).reduce((sum, product) => {
            if (product.id !== productId) {
                return sum + product.number;
            }
            return sum;
        }, 0);

        if ( productsSum + parseInt(number) > parseInt(item.number) ) {
            return res.status(400).json({ error: `Параллельный импорт не справился(((` });
        }

        await productOld.update({
            name: name,
            number: number,
            orderId: orderId,
        });

        const orders = await Order.findAll({
            include: [{
                model: Product,
                as: 'products',
            }],
        });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка изменения продукта' });
    }
});

app.delete('/api/product/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Выбранный товар не найден' });
        }

        await product.destroy()

        res.json({ message: 'Позиция удалена' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления заказов' });
    }
});

app.delete('/api/day', async (req, res) => {
    try {
        const { date } = req.body;

        if (!date || isNaN(Date.parse(date))) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const orders = await Order.findAll({
            include: [{
                model: Product,
                as: 'products',
            }],
            where: {
                date: {
                    [Op.lt]: new Date(date),
                },
            },
        });
        console.log(orders)

        const items = await Item.findAll();

        for (const order of orders) {
            for (const product of order.products) {
                await minusItem(product.itemId, product.number);
            }
            await order.destroy();
        }

        for (const item of items) {
            await plusItem(item.id);
        }

        res.json({ message: 'День переведён' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления заказов' });
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