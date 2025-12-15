const taskService = require("../services/taskService");

class TaskController {
  async getAllTasks(req, res, next) {
    try {
      const filters = {};
      if (req.query.status) filters.status = req.query.status.toUpperCase();
      if (req.query.priority)
        filters.priority = req.query.priority.toUpperCase();
      const tasks = await taskService.getAllTasks(filters);
      res.json({ success: true, data: tasks, count: tasks.length });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, error: "ID ไม่ถูกต้อง" });
      const task = await taskService.getTaskById(id);
      res.json({ success: true, data: task });
    } catch (error) {
      if (error.message.includes("ไม่พบ"))
        return res.status(404).json({ success: false, error: error.message });
      next(error);
    }
  }

  // src/controllers/taskController.js

  async createTask(req, res, next) {
    try {
      // จัดการแปลง assignees เป็น String ตาม logic เดิมของ Week 3
      let assigneesText = null;
      if (req.body.assignees) {
        if (Array.isArray(req.body.assignees))
          assigneesText = JSON.stringify(req.body.assignees);
        else assigneesText = req.body.assignees;
      }

      const taskData = {
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        priority: req.body.priority,
        // รับค่าเพิ่ม
        link: req.body.link,
        assignees: assigneesText,
      };

      const task = await taskService.createTask(taskData);
      res
        .status(201)
        .json({ success: true, data: task, message: "สร้างงานสำเร็จ" });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, error: "ID ไม่ถูกต้อง" });
      const task = await taskService.updateTask(id, req.body);
      res.json({ success: true, data: task, message: "อัพเดทงานสำเร็จ" });
    } catch (error) {
      if (error.message.includes("ไม่พบ"))
        return res.status(404).json({ success: false, error: error.message });
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, error: "ID ไม่ถูกต้อง" });
      await taskService.deleteTask(id);
      res.json({ success: true, message: "ลบงานสำเร็จ" });
    } catch (error) {
      if (error.message.includes("ไม่พบ"))
        return res.status(404).json({ success: false, error: error.message });
      next(error);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const stats = await taskService.getStatistics();
      res.json({ success: true, data: stats });
    } catch (error) {
      next(error);
    }
  }

  async moveToNextStatus(req, res, next) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id))
        return res.status(400).json({ success: false, error: "ID ไม่ถูกต้อง" });
      const task = await taskService.moveToNextStatus(id);
      res.json({ success: true, data: task, message: "เปลี่ยนสถานะงานสำเร็จ" });
    } catch (error) {
      if (error.message.includes("ไม่พบ"))
        return res.status(404).json({ success: false, error: error.message });
      if (error.message.includes("เสร็จสมบูรณ์แล้ว"))
        return res.status(400).json({ success: false, error: error.message });
      next(error);
    }
  }
}

module.exports = new TaskController();
