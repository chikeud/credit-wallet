import { Request, Response } from 'express';
import db from '../../lib/db';
import { Identity } from '../../types/identity';

export const verifyIdentity = async (user: { bvn: string; firstname: string; lastname: string, dob: string}) => {
    const dob = new Date(user.dob);

    const day = String(dob.getDate()).padStart(2, '0');
    const month = String(dob.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = dob.getFullYear();

    const formattedDob = `${day}-${month}-${year}`;

    const identity = await db('identities')
        .whereRaw("JSON_EXTRACT(bvn, '$.bvn') = ?", [user.bvn])
        .andWhereRaw("JSON_EXTRACT(bvn, '$.firstname') = ?", [user.firstname])
        .andWhereRaw("JSON_EXTRACT(bvn, '$.lastname') = ?", [user.lastname])
        .andWhereRaw("JSON_EXTRACT(bvn, '$.birthdate') = ?", [formattedDob])
        .first() as Identity;

    if (!identity) throw new Error('Identity not found');

    return {
        fullName: `${identity.applicant.firstname} ${identity.applicant.lastname}`,
        bvn: identity.bvn,
        dob: identity.bvn.birthdate,
        verified: identity.status
    };
};

export const verifyHandler = async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    const user = req.body;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer-')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    try {
        const result = await verifyIdentity(user);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error verifying identity:', error);
        res.status(500).json({ error: `${error}` });
    }
};