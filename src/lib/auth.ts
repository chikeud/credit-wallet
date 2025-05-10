export function fakeAuth(req, res, next) {
    const token = req.headers.authorization;
    if (!token || !token.startsWith('user-')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = parseInt(token.split('-')[1]);
    if (isNaN(userId)) return res.status(401).json({ error: 'Invalid token' });

    req.user = { id: userId };
    next();
}
