"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyHandler = exports.verifyIdentity = void 0;
const db_1 = __importDefault(require("../../lib/db"));
const dayjs_1 = __importDefault(require("dayjs"));
const verifyIdentity = async (user) => {
    const formattedDob = (0, dayjs_1.default)(user.dob).format('DD-MM-YYYY');
    const identity = await (0, db_1.default)('identities')
        .whereRaw("JSON_EXTRACT(bvn, '$.bvn') = ?", [user.bvn])
        .andWhereRaw("JSON_EXTRACT(bvn, '$.firstname') = ?", [user.firstname])
        .andWhereRaw("JSON_EXTRACT(bvn, '$.lastname') = ?", [user.lastname])
        .andWhereRaw("JSON_EXTRACT(bvn, '$.birthdate') = ?", [formattedDob])
        .first();
    if (!identity)
        throw new Error('Identity not found');
    return {
        fullName: `${identity.applicant.firstname} ${identity.applicant.lastname}`,
        bvn: identity.bvn,
        dob: identity.bvn.birthdate,
        verified: identity.status
    };
};
exports.verifyIdentity = verifyIdentity;
const verifyHandler = async (req, res) => {
    const authHeader = req.headers.authorization;
    const user = req.body;
    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer-')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }
    try {
        const result = await (0, exports.verifyIdentity)(user);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error verifying identity:', error);
        res.status(500).json({ error: `${error}` });
    }
};
exports.verifyHandler = verifyHandler;
