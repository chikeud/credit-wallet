import { registerUser, login } from '../api/handlers/userHandler';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import db from '../lib/db';
import { checkBlacklist } from '../lib/karma';

jest.mock('../lib/db');
jest.mock('../lib/karma');
jest.mock('bcryptjs');

describe('User Handler', () => {
    let req: Partial<Request>;
    let res: Response;
    let next: jest.Mock;

    const mockJson = jest.fn();
    const mockStatus = jest.fn(() => ({ json: mockJson }));

    beforeEach(() => {
        req = {};
        res = {
            status: mockStatus,
        } as unknown as Response;
        next = jest.fn();

        mockJson.mockClear();
        mockStatus.mockClear();
        (checkBlacklist as jest.Mock).mockReset();
        (bcrypt.hash as jest.Mock).mockReset();
        (bcrypt.compare as jest.Mock).mockReset();
    });

    describe('registerUser', () => {
        it('should register user and return success message', async () => {
            req.body = { name: 'John', email: 'john@example.com', password: 'password123' };

            (checkBlacklist as jest.Mock).mockResolvedValue(false);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_pass');

            (db as any).mockImplementation((table: string) => {
                if (table === 'users') {
                    return {
                        insert: jest.fn().mockResolvedValue([1]),
                    };
                }
                if (table === 'wallets') {
                    return {
                        insert: jest.fn().mockResolvedValue([1]),
                    };
                }
            });

            await registerUser(req as Request, res as Response, next);

            expect(checkBlacklist).toHaveBeenCalledWith('john@example.com');
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                userId: 1,
                message: 'User registered successfully',
            });
        });

        it('should block blacklisted users', async () => {
            req.body = { name: 'John', email: 'blacklisted@example.com', password: 'secret' };

            (checkBlacklist as jest.Mock).mockResolvedValue(true);

            await registerUser(req as Request, res as Response, next);

            expect(mockStatus).toHaveBeenCalledWith(403);
            expect(mockJson).toHaveBeenCalledWith({ error: 'User is blacklisted.' });
        });
    });

    describe('login', () => {
        it('should log in valid user and return token', async () => {
            req.body = { email: 'john@example.com', password: 'password123' };

            (db as any).mockImplementation((table: string) => ({
                where: jest.fn().mockReturnValue({
                    first: jest.fn().mockResolvedValue({
                        id: 1,
                        email: 'john@example.com',
                        password_hash: 'hashed_pass',
                    }),
                }),
            }));

            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            await login(req as Request, res as Response, next);

            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith({
                token: 'user-1',
                message: 'User logged In!',
            });
        });

        it('should fail for wrong credentials', async () => {
            req.body = { email: 'john@example.com', password: 'wrongpassword' };

            (db as any).mockImplementation((table: string) => ({
                where: jest.fn().mockReturnValue({
                    first: jest.fn().mockResolvedValue({
                        id: 1,
                        password_hash: 'hashed_pass',
                    }),
                }),
            }));

            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await login(req as Request, res as Response, next);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });

        it('should fail if user is not found', async () => {
            req.body = { email: 'notfound@example.com', password: 'any' };

            (db as any).mockImplementation((table: string) => ({
                where: jest.fn().mockReturnValue({
                    first: jest.fn().mockResolvedValue(undefined),
                }),
            }));

            await login(req as Request, res as Response, next);

            expect(mockStatus).toHaveBeenCalledWith(401);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Invalid credentials' });
        });
    });
});
