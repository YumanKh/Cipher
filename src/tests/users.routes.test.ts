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

describe('DELETE /me', () => {
    it('should return 400 when no auth value is provided', async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
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
            authValue: "password123",
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
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).delete(`/users/me`).set("Authorization", `Bearer ${user.body.accessToken}`).send({ authValue: "password123" });
        expect(response.status).toBe(200);
    });

    it.todo("should handle server errors gracefully");
});