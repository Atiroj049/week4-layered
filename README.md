# Task Board API (Layered Architecture) - Week 4

โปรเจกต์นี้เป็นส่วนหนึ่งของวิชา **ENGSE207 Software Architecture** โดยทำการ Refactor โปรเจกต์ Task Board จากแบบ Monolithic ให้เป็นแบบ **Layered Architecture (3-Tier)**

## 🏗️ โครงสร้างสถาปัตยกรรม (Architecture)

โปรเจกต์แบ่งออกเป็น 3 Layers หลัก:
1.  **Presentation Layer (`src/controllers`):** รับ Request, ตรวจสอบ Input เบื้องต้น, ส่ง Response
2.  **Business Logic Layer (`src/services`):** จัดการ Business Rules, Validation, การคำนวณ
3.  **Data Access Layer (`src/repositories`):** เชื่อมต่อ Database, จัดการ SQL Query

## 🚀 การติดตั้งและรันโปรเจกต์

1.  **Clone หรือ Download โปรเจกต์**
2.  **ติดตั้ง Dependencies:**
    ```bash
    npm install
    ```
3.  **รันโปรเจกต์:**
    ```bash
    npm run dev
    ```
    (Server จะรันที่ `http://localhost:3000`)

## 🔗 API Endpoints

### Tasks CRUD
* `GET /api/tasks` : ดูรายการงานทั้งหมด
* `GET /api/tasks/:id` : ดูงานรายตัว
* `POST /api/tasks` : สร้างงานใหม่
* `PUT /api/tasks/:id` : แก้ไขงาน
* `DELETE /api/tasks/:id` : ลบงาน

### Features พิเศษ (Week 4)
* `GET /api/tasks/stats` : ดูสถิติงาน (แยกตาม Status และ Priority)
* `PATCH /api/tasks/:id/next-status` : เลื่อนสถานะงานอัตโนมัติ (TODO -> IN_PROGRESS -> DONE)

## 🛠️ Tech Stack
* Node.js
* Express.js
* SQLite3
