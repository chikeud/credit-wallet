import { fund, withdraw, transfer, getWalletBalance } from '../api/handlers/walletHandler';
import { Request, Response } from 'express';
import db from '../lib/db';

jest.mock('../lib/db', () => {
    const mockDb: any = jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        increment: jest.fn(),
        decrement: jest.fn(),
        first: jest.fn(),
    }));

    // attach transaction method
    mockDb.transaction = jest.fn();

    return mockDb;
});


describe('Wallet Handler', () => {
    let req: Partial<Request & { userId: number }>;
    let res: Response;
    let next: jest.Mock;

    const mockJson = jest.fn();
    const mockStatus = jest.fn(() => ({ json: mockJson }));

    beforeEach(() => {
        req = {};
        res = {
            status: mockStatus,
            json: mockJson,
        } as unknown as Response;
        next = jest.fn();

        mockJson.mockClear();
        mockStatus.mockClear();
        (db as any).mockClear?.();
        (db as any).transaction.mockReset?.();
    });

    describe('fund', () => {
        it('should fund wallet successfully', async () => {
            req = {
                body: { amount: 100 },
                userId: 1,
            };

            (db as any).mockImplementation(() => ({
                where: jest.fn().mockReturnValue({
                    increment: jest.fn().mockResolvedValue(undefined),
                }),
            }));

            await fund(req as Request, res as Response, next);
            expect(mockJson).toHaveBeenCalledWith({ message: 'Wallet funded with ₦100' });
        });
    });

    describe('withdraw', () => {
        it('should withdraw if balance is sufficient', async () => {
            req = {
                body: { amount: 50 },
                userId: 1,
            };

            const trx = {
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue({ id: 1, user_id: 1, balance: 100 }),
                decrement: jest.fn().mockResolvedValue(undefined),
                commit: jest.fn(),
                rollback: jest.fn(),
            };

            (db as any).transaction.mockResolvedValue(trx);

            await withdraw(req as Request, res as Response, next);

            expect(trx.commit).toHaveBeenCalled();
            expect(mockJson).toHaveBeenCalledWith({ message: '₦50 withdrawn successfully' });
        });

        it('should fail if balance is insufficient', async () => {
            req = {
                body: { amount: 150 },
                userId: 1,
            };

            const trx = {
                where: jest.fn().mockReturnThis(),
                first: jest.fn().mockResolvedValue({ id: 1, user_id: 1, balance: 100 }),
                rollback: jest.fn(),
                decrement: jest.fn(),
                commit: jest.fn(),
            };

            (db as any).transaction.mockResolvedValue(trx);

            await withdraw(req as Request, res as Response, next);

            expect(trx.rollback).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Insufficient funds' });
        });
    });

    describe('transfer', () => {
        it('should transfer funds between users', async () => {
            req = {
                body: { recipientId: 2, amount: 50 },
                userId: 1,
            };

            let callCount = 0;
            const trx = {
                where: jest.fn().mockImplementation(({ user_id }: any) => {
                    return {
                        first: jest.fn().mockResolvedValue(
                            user_id === 1
                                ? { id: 1, user_id: 1, balance: 100 }
                                : { id: 2, user_id: 2, balance: 50 }
                        ),
                        decrement: jest.fn().mockResolvedValue(undefined),
                        increment: jest.fn().mockResolvedValue(undefined),
                    };
                }),
                decrement: jest.fn().mockResolvedValue(undefined),
                increment: jest.fn().mockResolvedValue(undefined),
                commit: jest.fn(),
                rollback: jest.fn(),
            };

            (db as any).transaction.mockResolvedValue(trx);

            await transfer(req as Request, res as Response, next);

            expect(trx.commit).toHaveBeenCalled();
            expect(mockJson).toHaveBeenCalledWith({ message: 'Transfer successful' });
        });

        it('should fail if recipient not found', async () => {
            req = {
                body: { recipientId: 2, amount: 50 },
                userId: 1,
            };

            const trx = {
                where: jest.fn().mockImplementation(({ user_id }: any) => {
                    return {
                        first: jest.fn().mockResolvedValue(
                            user_id === 1
                                ? { id: 1, user_id: 1, balance: 100 }
                                : undefined
                        ),
                        decrement: jest.fn(),
                        increment: jest.fn(),
                    };
                }),
                commit: jest.fn(),
                rollback: jest.fn(),
            };

            (db as any).transaction.mockResolvedValue(trx);

            await transfer(req as Request, res as Response, next);

            expect(trx.rollback).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Recipient not found' });
        });

        it('should fail if sender has insufficient funds', async () => {
            req = {
                body: { recipientId: 2, amount: 200 },
                userId: 1,
            };

            const trx = {
                where: jest.fn().mockImplementation(({ user_id }: any) => {
                    return {
                        first: jest.fn().mockResolvedValue(
                            user_id === 1
                                ? { id: 1, user_id: 1, balance: 100 }
                                : { id: 2, user_id: 2, balance: 50 }
                        ),
                    };
                }),
                rollback: jest.fn(),
                commit: jest.fn(),
            };

            (db as any).transaction.mockResolvedValue(trx);

            await transfer(req as Request, res as Response, next);

            expect(trx.rollback).toHaveBeenCalled();
            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Insufficient funds' });
        });
    });

    describe('getWalletBalance', () => {
        it('should return wallet balance if found', async () => {
            req = { userId: 1 };

            (db as any).mockImplementation(() => ({
                where: jest.fn().mockReturnValue({
                    first: jest.fn().mockResolvedValue({ id: 1, user_id: 1, balance: 500 }),
                }),
            }));

            await getWalletBalance(req as Request, res as Response, next);

            expect(mockJson).toHaveBeenCalledWith({ balance: 500 });
        });

        it('should return 404 if wallet not found', async () => {
            req = { userId: 1 };

            (db as any).mockImplementation(() => ({
                where: jest.fn().mockReturnValue({
                    first: jest.fn().mockResolvedValue(undefined),
                }),
            }));

            await getWalletBalance(req as Request, res as Response, next);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith({ error: 'Wallet not found' });
        });
    });
});
