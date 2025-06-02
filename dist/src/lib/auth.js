"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fakeAuth = void 0;
const fakeAuth = (req, res, next) => {
    const token = req.headers.authorization;
    if (token != null) {
        if (token?.startsWith('user-')) {
            const userId = parseInt(token.split('-')[1]);
            req.userId = userId;
            next();
        }
    }
    else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.fakeAuth = fakeAuth;
