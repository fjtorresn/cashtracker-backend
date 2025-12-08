import type { Request, Response } from 'express';
import User from '../models/User';
import { checkPassword, hashPassword } from '../utils/auth';
import { generateToken } from '../utils/token';
import { AuthEmail } from '../emails/AuthEmail';
import { generateJWT, validateJWT } from '../utils/jwt';


export class AuthController {
    static createAccount = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userExists = await User.findOne({ where: { email } });
        if (userExists) {
            return res.status(409).json({ message: 'El correo electrónico ya está en uso' });
        }
        try {
            const user = new User(req.body);
            user.password = await hashPassword(password);
            user.token = generateToken();
            await user.save();
            await AuthEmail.sendConfirmationEmail({
                name: user.name,
                email: user.email,
                token: user.token,
            });
            res.status(201).json({ message: 'Cuenta creada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la cuenta' + error });
        }
    }

    static confirmAccount = async (req: Request, res: Response) => {
        const { token } = req.body;
        try {
            const user = await User.findOne({ where: { token } });
            if (!user) {
                return res.status(401).json({ message: 'Token inválido' });
            }
            user.confirmed = true;
            user.token = '';
            await user.save();
            return res.status(200).json({ message: 'Cuenta confirmada exitosamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la cuenta' + error });
        }
    }

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json("El usuario no ha sido encontrado");
            }
            const isPasswordCorrect = await checkPassword(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(401).json("La contraseña es incorrecta");
            }
            if (!user.confirmed) {
                return res.status(403).json("La cuenta debe ser confirmada")
            }
            const token = generateJWT(user.id);
            return res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la cuenta' + error });
        }
    }

    static forgotPassword = async (req: Request, res: Response) => {
        const { email } = req.body;
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(404).json("El usuario no existe");
            }
            user.token = generateToken();
            await user.save();
            await AuthEmail.sendRecoveryEmail({
                name: user.name,
                email: user.email,
                token: user.token,
            });
            return res.status(200).json("Se ha enviado un mail de recuperación");
        } catch (error) {
            res.status(500).json({ message: 'Error al crear la cuenta' + error });
        }
    }

    static validateToken = async (req: Request, res: Response) => {
        const { token } = req.body;
        const user = await User.findOne({ where: { token } });
        if (!user) {
            return res.status(404).json("Token inválido");
        }
        res.status(200).json("Token válido");
    }

    static resetPasswordWithToken = async (req: Request, res: Response) => {
        const { token } = req.params;
        const { password } = req.body;
        const user = await User.findOne({ where: { token } })
        if (!user) {
            res.status(404).json({ error: "Token inválido" });
        }
        user.password = await hashPassword(password);
        user.token = null;
        await user.save();
        res.status(200).json("Contraseña actualizada");
    }

    static user = async (req: Request, res: Response) => {
        res.json(req.user)
    }
}