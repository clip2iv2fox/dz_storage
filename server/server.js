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
        res.status(500).json({ error: 'Ошибка получения данных из базы данных' });
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
            return res.status(404).json({ error: 'Тип упражнения не найден' });
        }

        await itemToDelete.destroy();

        const items = await Item.findAll();
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления типа упражнения' });
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
        res.status(500).json({ error: 'Ошибка получения тренировок' });
    }
});

app.post('/api/order', async (req, res) => {
    try {
        const { firstnName, secondName, fatherName, date } = req.body;

        const orders = await Order.findAll();
        const minExerciseDifficulty = Math.max(...exercises.map(exercise => exercise.difficulty));

        if (difficulty < minExerciseDifficulty) {
            return res.status(400).json({ error: 'Сложность тренировки не может быть меньше сложности упражнений' });
        }

        Workout.create({
            name: name || "без названия",
            description: description || "",
            difficulty: difficulty || 1,
            time: 0,
        });

        const workouts = await Workout.findAll({
            include: [{
                model: Practice,
                as: 'practices',
            }],
        });
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка создания тренировки' });
    }
});

app.put('/api/workout/:workoutId', async (req, res) => {
    try {
        const workoutId = req.params.workoutId;
        const { name, description, difficulty } = req.body;

        const workout = await Workout.findByPk(workoutId, {
            include: [{
                model: Practice,
                as: 'practices',
            }],
        });

        const exercises = await Exercize.findAll();
        const minExerciseDifficulty = Math.max(...exercises.map(exercise => exercise.difficulty));

        if (difficulty < minExerciseDifficulty) {
            return res.status(400).json({ error: 'Сложность тренировки не может быть меньше сложности упражнений' });
        }

        const practiceDifficultySum = (workout.practices || []).reduce((sum, practice) => sum + practice.difficulty, 0);

        if (practiceDifficultySum > difficulty) {
            return res.status(400).json({ error: 'Тренировка слишком лёгкая для упражнений' });
        }

        await workout.update({
            name: name,
            description: description,
            difficulty: difficulty,
        });

        const workouts = await Workout.findAll({
            include: [{
                model: Practice,
                as: 'practices',
            }],
        });

        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка изменения тренировки' });
    }
});

app.delete('/api/workout/:workoutId', async (req, res) => {
    try {
        const workoutId = req.params.workoutId;

        const workoutToDelete = await Workout.findByPk(workoutId);

        if (!workoutToDelete) {
            return res.status(404).json({ error: 'Тренировка не найдена' });
        }

        await workoutToDelete.destroy();

        const workouts = await Workout.findAll({
            include: [{
                model: Practice,
                as: 'practices',
            }],
        });
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления тренировки' });
    }
});

// практические упражнения тренировок
app.post('/api/practice/:workoutId', async (req, res) => {
    try {
        const workoutId = req.params.workoutId;
        const { name, description, difficulty, time } = req.body;

        const workout = await Workout.findByPk(workoutId, {
            include: [{
                model: Practice,
                as: 'practices',
            }],
        });

        if (!workout) {
            return res.status(404).json({ error: 'Выбранная тренировка не найдена' });
        }

        const practiceDifficultySum = (workout.practices || []).reduce((sum, practice) => sum + practice.difficulty, 0);

        if (practiceDifficultySum + difficulty > workout.difficulty) {
            return res.status(400).json({ error: 'Тренировка ' + workout.name + ' становится слишком сложная, дядька помрёт' });
        }

        await Practice.create({
            name: name,
            description: description,
            difficulty: difficulty,
            time: time,
            workoutId: workoutId,
        });

        await workout.update({
            time: parseInt(time) + parseInt(workout.time),
        });
        
        const workouts = await Workout.findAll({
            include: [{
                model: Practice,
                as: 'practices',
            }],
        });
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сохранения в базе данных' });
    }
});

app.put('/api/practice/:practiceId', async (req, res) => {
    try {
        const practiceId = req.params.practiceId;
        const { name, description, difficulty, time, workoutId } = req.body;
        
        const practice = await Practice.findByPk(practiceId);

        if (!practice) {
            return res.status(404).json({ error: 'Выбранное упражнение не найдено' });
        }

        const exercise = await Exercize.findOne({
            where:{
                name: name
            }
        });

        if (!exercise) {
            return res.status(404).json({ error: 'Выбранн тип не найден' });
        }

        const workout = await Workout.findByPk(workoutId, {
            include: [{
                model: Practice,
                as: 'practices',
            }],
        });

        if (!workout) {
            return res.status(404).json({ error: 'Выбранная тренировка не найдена' });
        }

        const practiceDifficultySum = (workout.practices || []).reduce((sum, practice) => {
            if (practice.id !== practiceId) {
                return sum + practice.difficulty;
            }
            return sum;
        }, 0);

        if (practiceDifficultySum + practice.difficulty > workout.difficulty) {
            return res.status(400).json({ error: 'Тренировка ' + workout.name + ' становится слишком сложная, дядька помрёт' });
        }

        const updatedTime = parseInt(time) || 0;

        await workout.update({
            time: updatedTime + parseInt(workout.time),
        });

        const workoutOld = await Workout.findByPk(practice.workoutId);

        if (!workoutOld) {
            return res.status(404).json({ error: 'старая тренировка не найдена' });
        }

        await workoutOld.update({
            time: parseInt(workoutOld.time) - parseInt(practice.time),
        });

        await practice.update({
            name: name,
            description: description,
            difficulty: difficulty,
            time: time,
            workoutId: workoutId,
        });
        
        const workouts = await Workout.findAll({
            include: [{
                model: Practice,
                as: 'practices',
            }],
        });
        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка изменения упражнения' });
    }
});

app.delete('/api/practice/:practiceId', async (req, res) => {
    try {
        const practiceId = req.params.practiceId;

        const practiceToDelete = await Practice.findByPk(practiceId);
        if (!practiceToDelete) {
            return res.status(404).json({ error: 'Выбранное упражнение не найдено' });
        }

        const workout = await Workout.findByPk(practiceToDelete.workoutId);

        const practiceTime = parseInt(practiceToDelete.time) || 0;

        await workout.update({
            time: parseInt(workout.time) - practiceTime,
        });

        await practiceToDelete.destroy();
        res.json({ message: 'Упражнение успешно удалено' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления упражнения' });
    }
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});