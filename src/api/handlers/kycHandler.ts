import { Request, Response } from 'express';
import openBankingClient from '../clients/openBankingClient';
import db from '../../lib/db';
import {IdentityResponse} from "../../types/response";
import { Identity} from "../../types/identity";

export const verifyIdentity = async ( id: number) => {
    //const identity = await openBankingClient.getIdentity(accessToken);
    const identity = await db('identities').where({ id: id }).first() as Identity;
    return {
        fullName: identity.applicant.firstname + " " +  identity.applicant.lastname ,
        bvn: identity.bvn,
        dob: identity.bvn.birthdate,
        verified: identity.status
    };
};

export const verifyHandler = async (req, res) => {
    const authHeader = req.headers.authorization;

    if (typeof authHeader !== 'string' || !authHeader.startsWith('Bearer-')) {
        return res.status(401).json({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split('-')[1];

    try {
        const result = await verifyIdentity(parseInt(token) );
        res.json(result);
    } catch (error) {
        console.error('Error verifying identity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}