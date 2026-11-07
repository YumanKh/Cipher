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
    await prisma.passwords.deleteMany();
});


describe("GET /passwords", () => {
    it("should return 401 if user ID is not provided", async () => {
        const response = await supertest(app).get("/passwords");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 401 if user is not found", async () => {
        const response = await supertest(app).get("/passwords").set("Authorization", "Bearer invalid_token");
        expect(response.status).toBe(401);
        expect(response.body).toEqual({ error: "Unauthorized" });
    });

    it("should return 200 and passwords for a valid user", async () => {
        const user = await supertest(app).post("/auth/register").send({
            name: "Test User",
            email: "testuser@example.com",
            authValue: "password123",
            cryptingKey: "key123",
            kdfSalt: "salt123",
        });

        const token = user.body.tokens.accessToken;
        const response = await supertest(app).get("/passwords").set("Authorization", `Bearer ${token}`);
        expect(user.status).toBe(201);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ passwords: [] });
    });

    it.todo("should handle server errors gracefully");
});