import { Request, Response, NextFunction } from "express";
import { validateJWT } from "../utils/jwt";
import User from "../models/User";

declare global {
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        return res.status(401).json({ error: "No autorizado" });
    }
    const [, token] = bearer.split(' ');
    if (!token) {
        return res.status(401).json({ error: "Token no válido" });
    }
    try {
        const decoded = validateJWT(token);
        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findByPk(decoded.id, {
                attributes: ['id', 'name', 'email']
            });
            if (!user) {
                return res.status(404).json({ error: "El usuario no existe" });
            }
            req.user = user;
            next();
        }

    } catch (error) {
        res.status(500).json({ error: "Token no válido" });
    }
}