const express = require('express');
const bodyParser = require('body-parser');
const { Op } = require('sequelize');
const { Exercize, Workout, Practice } = require('./models');

const app = express();
const port = 5000;
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

// типы упражнений
app.post('/api/exercize', async (req, res) => {
    try {
        const { name, difficulty } = req.body;
        Exercize.create({
            name: name || 'неизвестен',
            difficulty: difficulty || 1,
        });
        
        const exercize = await Exercize.findAll();
        res.json(exercize);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка сохранения в базе данных' });
    }
});

app.get('/api/exercize', async (req, res) => {
    try {
        const exercize = await Exercize.findAll();
        res.json(exercize);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения данных из базы данных' });
    }
});

app.delete('/api/exercize/:exercizeId', async (req, res) => {
    try {
        const exercizeId = req.params.exercizeId;
        const exercizeToDelete = await Exercize.findByPk(exercizeId);
        if (!exercizeToDelete) {
            return res.status(404).json({ error: 'Тип упражнения не найден' });
        }

        await exercizeToDelete.destroy();

        const exercize = await Exercize.findAll();
        res.json(exercize);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка удаления типа упражнения' });
    }
});

// тренировки
app.get('/api/workout', async (req, res) => {
    try {
        const workouts = await Workout.findAll({
            include: [{
                model: Practice,
                as: 'practices',
            }],
        });

        res.json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Ошибка получения тренировок' });
    }
});

app.post('/api/workout', async (req, res) => {
    try {
        const { name, description, difficulty } = req.body;

        Workout.create({
            name: name || "без названия",
            description: description || "",
            difficulty: difficulty || 0,
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

        const workout = await Workout.findByPk(workoutId);

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

        const practiceDifficultySum = workout.practices.reduce((sum, practice) => sum + practice.difficulty, 0);

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
            time: time + workout.time,
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
        const { description, time, workoutId } = req.body;

        const practice = await Practice.findByPk(practiceId);

        if (!practice) {
            return res.status(404).json({ error: 'Выбранное упражнение не найдено' });
        }

        const workout = await Workout.findByPk(workoutId, {
            include: [{
                model: Practice,
                as: 'practices',
                id: { [Op.ne]: practiceId}
            }],
        });

        if (!workout) {
            return res.status(404).json({ error: 'Выбранная тренировка не найдена' });
        }

        const practiceDifficultySum = workout.practices.reduce((sum, practice) => sum + practice.difficulty, 0);

        if (practiceDifficultySum + practice.difficulty > workout.difficulty) {
            return res.status(400).json({ error: 'Тренировка ' + workout.name + ' становится слишком сложная, дядька помрёт' });
        }

        const workoutOld = await Workout.findByPk({
            where: {
                workoutId: practice.workoutId
            }
        });

        await workoutOld.update({
            time: workoutOld.time - practice.time,
        });

        await workout.update({
            time: time + workout.time,
        });

        await practice.update({
            description: description,
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

        const workout = await Workout.findByPk({
            where: {
                workoutId: practiceToDelete.workoutId
            }
        });

        await workout.update({
            time: workout.time - practiceToDelete.time,
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