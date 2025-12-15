const sqlite3 = require('sqlite3').verbose();
const path = require('path'); // เพิ่มการใช้ path เพื่อความชัวร์เรื่องที่อยู่ไฟล์
require('dotenv').config();

class Database {
    constructor() {
        this.db = null;
    }

    connect() {
        return new Promise((resolve, reject) => {
            // ใช้ path.resolve เพื่อระบุตำแหน่งไฟล์ให้แม่นยำ
            const dbPath = path.resolve(__dirname, 'tasks.db');
            
            this.db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    console.error('❌ เชื่อมต่อฐานข้อมูลล้มเหลว:', err.message);
                    reject(err);
                } else {
                    console.log('✅ เชื่อมต่อฐานข้อมูลสำเร็จที่:', dbPath);
                    
                    // สร้างตารางพร้อมคอลัมน์ link และ assignees
                    const createTableSql = `
                        CREATE TABLE IF NOT EXISTS tasks (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            title TEXT NOT NULL,
                            description TEXT,
                            link TEXT,              
                            assignees TEXT,         
                            status TEXT DEFAULT 'TODO',
                            priority TEXT DEFAULT 'MEDIUM',
                            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                        )
                    `;

                    this.db.run(createTableSql, (err) => {
                        if (err) {
                            console.error('❌ สร้างตารางไม่สำเร็จ:', err.message);
                            reject(err);
                        } else {
                            console.log('✅ ตาราง tasks พร้อมใช้งาน (รองรับ Link/Assignees)');
                            resolve(this.db);
                        }
                    });
                }
            });
        });
    }

    getConnection() {
        if (!this.db) {
            throw new Error('ยังไม่ได้เชื่อมต่อฐานข้อมูล เรียก connect() ก่อน');
        }
        return this.db;
    }

    close() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.db.close((err) => {
                    if (err) reject(err);
                    else resolve();
                });
            } else {
                resolve();
            }
        });
    }

    // Helper: Run query
    run(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ lastID: this.lastID, changes: this.changes });
            });
        });
    }

    // Helper: Get single row
    get(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    // Helper: Get all rows
    all(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = new Database();