require('dotenv').config();
const express = require('express');
const database = require('./database/connection');
const taskController = require('./src/controllers/taskController');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/api/tasks/stats', taskController.getStatistics.bind(taskController));
app.get('/api/tasks', taskController.getAllTasks.bind(taskController));
app.get('/api/tasks/:id', taskController.getTaskById.bind(taskController));
app.post('/api/tasks', taskController.createTask.bind(taskController));
app.put('/api/tasks/:id', taskController.updateTask.bind(taskController));
app.delete('/api/tasks/:id', taskController.deleteTask.bind(taskController));
app.patch('/api/tasks/:id/next-status', taskController.moveToNextStatus.bind(taskController));
app.patch('/api/tasks/:id/status', taskController.updateTask.bind(taskController)); 
app.patch('/api/tasks/:id/next-status', taskController.moveToNextStatus.bind(taskController));
// Error Handling (ต้องอยู่ท้ายสุด)
app.use(errorHandler);

// Start Server
async function startServer() {
    try {
        await database.connect();
        app.listen(PORT, () => {
            logger.info(`🚀 เซิร์ฟเวอร์ทำงานที่ http://localhost:${PORT}`);
            logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
        });
    } catch (error) {
        logger.error('ไม่สามารถเริ่มเซิร์ฟเวอร์ได้:', error);
        process.exit(1);
    }
}

process.on('SIGINT', async () => {
    logger.info('กำลังปิดเซิร์ฟเวอร์...');
    await database.close();
    process.exit(0);
});

startServer();