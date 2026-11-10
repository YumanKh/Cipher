import supertest from "supertest";
import app from "../app.js";
import { describe, it, expect, beforeEach } from "vitest";
import { prisma } from "../lib/prisma.js";
import { config } from "../config.js";

if (!config.DATABASE_URL?.includes("cipher_test")) {
    throw new Error("Tests must run on the test database");
}

beforeEach(async () => {
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();
});

describe('PATCH /me/datas', () => {
    it('should return 401 when no user id is provided', async () => {
        const response = await supertest(app).patch(`/users/me/datas`);
        expect(response.status).toBe(401);
    });

    it('should return 400 when no data is provided', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password1234",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).patch(`/users/me/datas`).set("Authorization", `Bearer ${user.body.accessToken}`).send({});
        expect(response.status).toBe(400);
    });

    it('should return 409 when the email is already taken', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password1234",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        await supertest(app).post("/auth/register").send({
            name: "Another User",
            email: "anotheruser@example.com",
            authValue: "password1234",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).patch(`/users/me/datas`).set("Authorization", `Bearer ${user.body.accessToken}`).send({
            email: "anotheruser@example.com",
        });
        expect(response.status).toBe(409);
    });

    it('should return 200 when only the email field is provided', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password1234",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).patch(`/users/me/datas`).set("Authorization", `Bearer ${user.body.accessToken}`).send({
            email: "updatedemail@example.com",
        });
        expect(response.status).toBe(200);
    });

    it('should return 200 when only the name is provided', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password1234",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).patch(`/users/me/datas`).set("Authorization", `Bearer ${user.body.accessToken}`).send({
            name: "Updated Name",
        });
        expect(response.status).toBe(200);
    });

    it('should return 200 when modification is successful', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password1234",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).patch(`/users/me/datas`).set("Authorization", `Bearer ${user.body.accessToken}`).send({
            name: "Updated Name",
            email: "updatedemail@example.com",
        });
        expect(response.status).toBe(200);
    });

    it.todo("should handle server errors gracefully")
});

describe('PATCH /me/password', () => {
    it('should return 401 when no user id is provided', async () => {
        const response = await supertest(app).patch(`/users/me/password`);
        expect(response.status).toBe(401);
    });

    it('should return 400 when no new password is provided', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password1234",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).patch(`/users/me/password`).set("Authorization", `Bearer ${user.body.accessToken}`).send({});
        expect(response.status).toBe(400);
    });

    it('should return 401 when the current password is incorrect', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password1234",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).patch(`/users/me/password`).set("Authorization", `Bearer ${user.body.accessToken}`).send({
            currentAuthValue: "wrongpassword",
            newAuthValue: "newpassword1234",
            cryptingKey: "key123",
        });
        expect(response.status).toBe(401);
    });

    it('should return 200 when modification is successful', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password1234",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).patch(`/users/me/password`).set("Authorization", `Bearer ${user.body.accessToken}`).send({
            currentAuthValue: "password1234",
            newAuthValue: "newpassword1234",
            cryptingKey: "key123",
        });
        expect(response.status).toBe(200);
    });

    it.todo('should handle server errors gracefully');
});

describe('DELETE /me', () => {
    it('should return 400 when no auth value is provided', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password12344",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).delete(`/users/me`).set("Authorization", `Bearer ${user.body.accessToken}`);
        expect(response.status).toBe(400);
    });

    it('should return 401 when no authorization header is provided', async () => {
        const response = await supertest(app).delete(`/users/me`);
        expect(response.status).toBe(401);
    });

    it('should return 401 with an invalid auth value', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password12344",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        await supertest(app).delete(`/users/me`).set("Authorization", `Bearer ${user.body.accessToken}`);
        const response = await supertest(app).delete(`/users/me`).set("Authorization", `Bearer ${user.body.accessToken}`).send({ authValue: "invalid" });
        expect(response.status).toBe(401);
    });

    it('should return 200 when the correct auth value is provided', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password12344",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).delete(`/users/me`).set("Authorization", `Bearer ${user.body.accessToken}`).send({ authValue: "password12344" });
        expect(response.status).toBe(200);
    });

    it.todo("should handle server errors gracefully");
});