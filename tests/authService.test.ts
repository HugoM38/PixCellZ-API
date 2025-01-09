import request from 'supertest';
import {app} from '../src/app';
import User from '../src/models/userModel';
import dotenv from 'dotenv';

dotenv.config();

describe('Auth Services', () => {
    let user: any;

    beforeEach(async () => {
        user = await User.create({
            username: 'testuser',
            email: 'test@example.com',
            password: '$2y$10$fHT9wOeac8Dg9BcXPY7d4O5wvWMN0bT4dDoAEz8C6nxdUZwaQ96.e',
        });
        await user.save();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/signup', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: 'jane_doe',
                    email: 'jane.doe@example.com',
                    password: 'Password123',
                });
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty('token');
            expect(response.body.user.email).toBe('jane.doe@example.com');
        });

        it('should not register an existing user', async () => {
            const response = await request(app)
                .post('/api/auth/signup')
                .send({
                    username: 'testuser',
                    email: 'test@example.com',
                    password: 'Password123',
                });
            expect(response.status).toBe(409);
            expect(response.body.error).toBe('Utilisateur déjà existant');
        });
    });

    describe('POST /api/auth/signin', () => {
        it('should login a user', async () => {
            const response = await request(app)
                .post('/api/auth/signin')
                .send({
                    email: 'test@example.com',
                    password: 'Password123',
                });
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('token');
        });

        it('should not login a non-registered user', async () => {
            const response = await request(app)
                .post('/api/auth/signin')
                .send({
                    email: 'nonexistent@myges.fr',
                    password: 'Password123',
                });
            expect(response.status).toBe(404);
            expect(response.body.error).toBe('Utilisateur non trouvé');
        });

        it('should not login with invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/signin')
                .send({
                    email: 'test@example.com',
                    password: 'wrongpassword',
                });
            expect(response.status).toBe(401);
            expect(response.body.error).toBe('Identifiants invalides');
        });
    });
});
