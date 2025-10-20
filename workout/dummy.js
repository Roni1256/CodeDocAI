export const fileContent=`// app.js

const express = require('express');
const bodyParser = require('body-parser');
const { Database } = require('./database');
const { AuthController } = require('./auth');

const app = express();
app.use(bodyParser.json());

const db = new Database();
const authController = new AuthController(db);

app.post('/register', (req, res) => {
    const data = req.body;
    res.status(authController.registerUser(data).status).json(authController.registerUser(data).message);
});

app.post('/login', (req, res) => {
    const data = req.body;
    res.status(authController.loginUser(data).status).json(authController.loginUser(data).message);
});

app.get('/users', (req, res) => {
    res.status(200).json(authController.getAllUsers());
});

app.listen(3000, () => console.log('Server running on port 3000'));


// database.js

class Database {
    constructor() {
        this.users = [];
    }

    addUser(user) {
        this.users.push(user);
    }

    getUsers() {
        return this.users;
    }
}

module.exports = { Database };


// auth.js

class AuthController {
    constructor(db) {
        this.db = db;
    }

    registerUser(data) {
        this.db.addUser(data);
        return { message: { message: 'User registered successfully.' }, status: 201 };
    }

    loginUser(data) {
        const user = this.db.getUsers().find(u => u.username === data.username);
        if (user) {
            return { message: { message: 'Login successful.' }, status: 200 };
        }
        return { message: { message: 'Invalid credentials.' }, status: 401 };
    }

    getAllUsers() {
        return { users: this.db.getUsers() };
    }
}

module.exports = { AuthController };
`