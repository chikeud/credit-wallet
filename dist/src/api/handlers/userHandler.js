"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.login = login;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../../lib/db"));
const karma_1 = require("../../lib/karma");
async function registerUser(req, res, next) {
    const { name, email, password } = req.body;
    try {
        const blacklisted = await (0, karma_1.checkBlacklist)(email);
        if (blacklisted) {
            return res.status(403).json({ error: 'User is blacklisted.' });
        }
        const saltRounds = 10;
        const password_hash = await bcryptjs_1.default.hash(password, saltRounds);
        // Create a user object (id is optional because it's auto-generated)
        const newUser = { name, email, password_hash };
        const [userId] = await (0, db_1.default)('users').insert(newUser);
        await (0, db_1.default)('wallets').insert({ user_id: userId, balance: 0 });
        return res.status(201).json({ userId, message: 'User registered successfully' });
    }
    catch (err) {
        next(err);
    }
}
async function login(req, res, next) {
    const { email, password } = req.body;
    try {
        const user = await (0, db_1.default)('users').where({ email }).first();
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const authorized = await bcryptjs_1.default.compare(password, user.password_hash);
        const token = 'user-' + user.id;
        if (!authorized) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        return res.status(201).json({ token, message: 'User logged In!' });
    }
    catch (err) {
        next(err);
    }
}
