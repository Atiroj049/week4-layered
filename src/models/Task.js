class Task {
    constructor(data = {}) {
        this.id = data.id || null;
        this.title = data.title || '';
        this.description = data.description || '';
        this.status = data.status || 'TODO';
        this.priority = data.priority || 'MEDIUM';
        // เพิ่ม 2 บรรทัดนี้จาก Week 3
        this.link = data.link || null;
        this.assignees = data.assignees || null;
        
        this.created_at = data.created_at || null;
        this.updated_at = data.updated_at || null;
    }

    isValid() {
        const errors = [];
        if (!this.title || this.title.trim().length < 1) errors.push('Title is required');
        return { valid: errors.length === 0, errors };
    }

    toDatabase() {
        return {
            title: this.title.trim(),
            description: this.description ? this.description.trim() : null,
            status: this.status,
            priority: this.priority,
            // เพิ่มส่งค่าลง Database
            link: this.link,
            assignees: this.assignees
        };
    }
}

module.exports = Task;