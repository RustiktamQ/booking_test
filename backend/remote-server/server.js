"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pg_1 = require("pg");
// sry for lazy method :/
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'remote_api',
    password: 'postgres',
    port: 5432,
});
const APP_PORT = 4001;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post('/api/saveUserStatus', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, status } = req.body;
    if (typeof user_id !== 'number' || typeof status !== 'string') {
        return res.status(400).json({ error: 'Invalid input' });
    }
    try {
        yield pool.query(`INSERT INTO users_status (user_id, status) VALUES ($1, $2)`, [user_id, status]);
        res.status(200).json({ message: 'User status saved' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB error' });
    }
}));
app.get('/api/getUserStatus/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = Number(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid param' });
    }
    try {
        const result = yield pool.query(`SELECT status FROM users_status WHERE user_id = $1`, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ user_id: userId, status: result.rows[0].status });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: 'DB error' });
    }
}));
app.listen(APP_PORT, () => {
    console.log(`REMOTE API started: http://localhost:${APP_PORT}`);
});
