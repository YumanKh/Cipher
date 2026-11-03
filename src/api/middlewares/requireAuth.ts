import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config.js";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"];
    if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    
    if (token.startsWith("Bearer ")) {
        const actualToken = token.split(" ")[1];

        try {
            const payload = jwt.verify(actualToken, config.JWT_SECRET) as unknown as { id: number };

            req.userId = payload.id; 
        } catch(error) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

    } else {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }

    next();
}