import TaskModel from '../models/task.model.js';

export const test = (req, res, next) => {
    res.send('Hello World!');
}

export const setTime = async (req, res, next) => {
    try {
        const { startDate, endDate } = req.body.dueDate;
        const startTime = new Date(startDate);
        const endTime = new Date(endDate);

        const duration = endTime.getTime() - startTime.getTime();
        let durationValue;
        let durationUnit;
        if (duration < 60000) {
            durationValue = Math.floor(duration / 1000);
            durationUnit = "Seconds";
        } else if (duration < 3600000) {
            durationValue = Math.floor(duration / 60000);
            durationUnit = "Minutes";
        } else if (duration < 86400000) {
            durationValue = Math.floor(duration / 3600000);
            durationUnit = "Hours";
        } else {
            durationValue = Math.floor(duration / 86400000);
            durationUnit = "Days";
        }
        const formatStart = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const formatEnd = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        req.body.startTime = formatStart;
        req.body.endTime = formatEnd;
        req.body.duration = durationValue;
        req.body.durationType = durationUnit;

        next();
    } catch (error) {
        next(error);
    }
}

export const ValidateInput = (req, res, next) => {
    const { name, description, status, dueDate } = req.body;
    if (!name || !description || !status || !dueDate) {
        return res.status(400).json({ message: "Please fill all the fields" });
    }
    next();
}

export const addTask = async (req, res, next) => {
    try {
        const newTask = await TaskModel.create(req.body);
        return res.status(201).json(newTask);
    } catch (error) {
        console.error("Database Error:", error.message);
        next(error);
    }
}

export const getTasks = async (req, res, next) => {
    try {
        const tasks = await TaskModel.find({});
        if (tasks) {
            return res.status(200).json(tasks);
        }
    } catch (error) {
        next(error);
    }
}

export const updateTask = async (req, res, next) => {
    const taskId = req.query.id;
    const updates = req.body;

    try {
        const updatedTask = await TaskModel.findByIdAndUpdate(taskId, updates, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
        return res.status(200).json(updatedTask);
    } catch (error) {
        next(error);
    }
}

export const findById = async (req, res, next) => {
    const taskId = req.query.id;

    try {
        const foundTask = await TaskModel.findById(taskId);
        if (!foundTask) {
            return res.status(404).json({ message: "Task not found" });
        }
        return res.status(200).json(foundTask);
    } catch (error) {
        next(error);
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        const deletedTask = await TaskModel.findByIdAndDelete(req.query.id);
        return res.status(200).json({ message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
}
