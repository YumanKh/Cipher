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
    await prisma.note.deleteMany();
});

describe("/auth/register", () => {
    it("should register a new user successfully", async () => {
        const response = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        expect(response.status).toBe(201);
        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user).toHaveProperty("name");
        expect(response.body.user).toHaveProperty("email");
        expect(response.body.user.hashedPassword).toBeUndefined();
        expect(response.body.tokens.refreshToken).toBeDefined();
        expect(response.body.tokens.accessToken).toBeDefined();
    })

    it("should fail to register a user with missing fields", async () => {
        const response = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
        });

        expect(response.status).toBe(400);
    });

    it("should fail to register a user with incorrect field types", async () => {
        const response = await supertest(app).post("/auth/register").send({
            name: 123,
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        expect(response.status).toBe(400);
    });

    it("should fail to register a user with duplicate email", async () => {
        await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });
        const response = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });
        
        expect(response.status).toBe(409);
    });

    it.todo("should handle server errors gracefully");
});

describe("/auth/login", () => {
    it("should login a user successfully", async () => {
        await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).post("/auth/login").send({
            email: "testuser@example.com",
            authValue: "password123",
        });

        expect(response.status).toBe(200);
        expect(response.body.user).toHaveProperty("id");
        expect(response.body.user).toHaveProperty("name");
        expect(response.body.user).toHaveProperty("email");
        expect(response.body.user.cryptingKey).toBe("key123");
        expect(response.body.user.kdfSalt).toBe("salt123");
        expect(response.body.user.hashedPassword).toBeUndefined();
        expect(response.body.tokens.refreshToken).toBeDefined();
        expect(response.body.tokens.accessToken).toBeDefined();
    });

    it("should fail to login a user with incorrect password", async () => {
        await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).post("/auth/login").send({
            email: "testuser@example.com",
            authValue: "wrongpassword",
        });

        expect(response.status).toBe(401);
    });

    it("should fail to login a user with incorrect email", async () => {
        await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).post("/auth/login").send({
            email: "wrongemail@example.com",
            authValue: "password123",
        });

        expect(response.status).toBe(401);
    });

    it("should fail to login a user with missing fields", async () => {
        await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).post("/auth/login").send({
            email: "testuser@example.com",
        });

        expect(response.status).toBe(400);
    });

    it.todo("should handle server errors gracefully");
});

describe("/auth/logout", () => {
    it("should return 200 and delete nothing for an unknown refresh token", async () => {
        await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).post("/auth/logout").send({
            refreshToken: "valid-refresh-token",
        });

        const bodyCount = await prisma.refreshToken.count();
        
        expect(response.status).toBe(200);
        expect(bodyCount).toBe(1);
        expect(response.body.message).toBe("User logged out successfully");
    });

    it("should successfully logout a user with a valid refresh token", async () => {
        const loginResponse = await supertest(app).post("/auth/register").send({
                name: "Test User",
                email: "testuser@example.com",
                authValue: "password123",
                cryptingKey: "key123",
                kdfSalt: "salt123",
            });

            const response = await supertest(app).post("/auth/logout").send({
                refreshToken: loginResponse.body.tokens.refreshToken,
            });

            const bodyCount = await prisma.refreshToken.count();
            
            expect(response.status).toBe(200);
            expect(bodyCount).toBe(0);
            expect(response.body.message).toBe("User logged out successfully");
        });

    it("should fail to logout a user with missing fields", async () => {
        const response = await supertest(app).post("/auth/logout").send({});

        expect(response.status).toBe(400);
    });

    it.todo("should handle server errors gracefully");
});

describe("/auth/refresh", () => {
    it("should successfully refresh tokens with a valid refresh token", async () => {
        const registerResponse = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const response = await supertest(app).post("/auth/refresh").send({
            refreshToken: registerResponse.body.tokens.refreshToken,
        });

        expect(response.status).toBe(200);
        expect(response.body.tokens).toHaveProperty("accessToken");
        expect(response.body.tokens).toHaveProperty("refreshToken");
    });

    it("should fail to refresh tokens with an invalid refresh token", async () => {
        const response = await supertest(app).post("/auth/refresh").send({
            refreshToken: "invalid-refresh-token",
        });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Invalid or expired refresh token");
    });

    it("should fail to refresh tokens with an already used refresh token", async () => {
         const registerResponse = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const refreshResponse = await supertest(app).post("/auth/refresh").send({
            refreshToken: registerResponse.body.tokens.refreshToken,
        });

        const response = await supertest(app).post("/auth/refresh").send({
            refreshToken: registerResponse.body.tokens.refreshToken,
        });

        expect(refreshResponse.status).toBe(200)
        expect(response.status).toBe(401);
        expect(response.body.error).toBe("Invalid or expired refresh token");
    });

    it("should fail to refresh tokens with missing fields", async () => {
        const response = await supertest(app).post("/auth/refresh").send({});

        expect(response.status).toBe(400);
    });

    it.todo("should handle server errors gracefully");
});