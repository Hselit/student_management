# Student Management

REST API for managing **staff** and **students** with MySQL, Sequelize, JWT authentication, and optional profile image uploads for students.

## Stack

- **Runtime:** Node.js  
- **Framework:** Express 4  
- **ORM:** Sequelize 6 + sequelize-cli (migrations & seeders)  
- **Database:** MySQL (`mysql2`)  
- **Auth:** `jsonwebtoken`  
- **Validation:** `express-validator`  
- **Uploads:** Multer (JPEG/PNG/JPG → `./uploads/`)  
- **Static assets:** `public/` (including `index.html`), uploaded files served at `/uploads`

## Data model

- **Staff** (`staffs`): `staffName`, `role`, `experience`, `password`  
- **Student** (`students`): `studentName`, `marks`, `age`, `password`, optional `profile` (filename), `staff_id` → staff  

Staff **has many** students; each student **belongs to** one staff member.

## Prerequisites

- Node.js (compatible with the dependencies in `package.json`)  
- MySQL server  
- A database that matches `config/config.json` (default development DB name: `sequelize`)

## Configuration

### 1. Database — `config/config.json`

Update `development` (and other environments as needed) with your MySQL `username`, `password`, `database`, and `host`.

### 2. Environment — `.env` (not committed; see `.gitignore`)

Create a `.env` file in the project root:

```env
JWT_SECRET=your-secret-key-here
```

Optional:

```env
PORT=3000
```

### 3. Upload directory

Multer writes to `./uploads/`. Create it if it does not exist:

```bash
mkdir -p uploads
```

## Install and run

```bash
npm install
```

Create the database in MySQL, then apply schema and sample data:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

Start the server:

```bash
npm start
```

Default URL: `http://localhost:3000` (or `PORT` from `.env`).

## Authentication

Protected routes expect a JWT in the **`Authorization`** request header. The middleware passes the header value directly to `jwt.verify`, so send the **raw token string** (not `Bearer <token>`), unless you change `middleware/auth.js` to strip a `Bearer ` prefix.

- **Staff login:** `POST /staff/stafflogin` — body: `staffName`, `password`, `role` (the `role` you send is embedded in the token and used for `roleMiddleware`; use `"Admin"` for admin-only routes).  
- **Student login:** `POST /student/studentlogin` — body: `studentName`, `password`; token includes `role: "student"`.

Tokens expire in **1 hour**.

## API overview

Base paths: `/staff`, `/student`. JSON bodies unless noted.

### Staff

| Method | Path | Auth / role | Description |
|--------|------|----------------|-------------|
| POST | `/staff/stafflogin` | — | Staff login → JWT |
| POST | `/staff/` | — | Create staff |
| GET | `/staff/` | JWT + Admin | List all staff |
| GET | `/staff/:id` | JWT + Admin | Get one staff |
| PUT | `/staff/:id` | JWT + Admin | Update staff |
| DELETE | `/staff/:id` | JWT + Admin | Delete staff |
| GET | `/staff/getallstudent/:id` | JWT + Admin | Staff `:id` with related students (limited fields) |

### Students

| Method | Path | Auth / role | Description |
|--------|------|----------------|-------------|
| POST | `/student/studentlogin` | — | Student login → JWT |
| GET | `/student/` | JWT | List all students |
| GET | `/student/:id` | JWT + Admin | Get one student |
| POST | `/student/` | JWT + Admin | Create student; multipart field `profile` (image) optional |
| PUT | `/student/:id` | JWT + Admin | Update student; optional `profile` file |
| DELETE | `/student/:id` | JWT + Admin | Delete student |
| GET | `/student/getstaff/:id` | JWT + Admin | Staff `:id` with students (`:id` is staff id) |

Uploaded profile images are stored under `uploads/` and referenced by filename; they are available under `/uploads/<filename>`.

## Seeded demo data

After `db:seed:all`, the database includes sample staff (e.g. admin **Arun Prakash**) and students. Default passwords in the seeder are plain `12345678` — change them and use hashing before any production use.

## Project layout

```
├── app.js                 # Express app, routes, static & uploads
├── bin/www                # HTTP server entry (port from PORT or 3000)
├── config/config.json     # Sequelize DB config
├── middleware/            # auth, validators, multer upload
├── models/                # Sequelize models & index
├── migrations/            # create staffs / students tables
├── seeders/               # sample staff & students
├── routes/                # index, staff, student routers
├── public/                # static front page & styles
└── uploads/               # profile images (create locally; gitignored if you add it)
```

## Scripts

| Script | Command |
|--------|---------|
| Start | `npm start` → `node ./bin/www` |

---

**Security note:** Passwords are compared and stored as plain text in the current code and seeders. For real deployments, use bcrypt (or similar), HTTPS, rotate `JWT_SECRET`, and restrict who can create staff accounts (`POST /staff/` is currently unauthenticated).
