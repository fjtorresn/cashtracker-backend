import { type Request, type Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Budget from "../models/Budget";

declare global {
    namespace Express {
        interface Request {
            budget?: Budget;
        }
    }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {
    await param('budgetID')
        .isInt().withMessage('ID no válido')
        .custom(value => value > 0).withMessage('ID no válido')
        .run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const budget = await Budget.findByPk(req.params.budgetID);
        if (!budget) {
            const error = new Error("Budget not found");
            return res.status(404).json({ error: error.message });
        }
        req.budget = budget;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const validateBudgetInputs = async (req: Request, res: Response, next: NextFunction) => {
    await body('name')
        .notEmpty()
        .withMessage('El nombre no puede estar vacío')
        .run(req);
    await body('amount')
        .notEmpty().withMessage('El monto es obligatorio')
        .isNumeric().withMessage('El monto debe ser un número decimal')
        .custom(value => value > 0).withMessage('El monto debe ser un número positivo')
        .run(req);
    next();
}

export const hasAccess = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.id !== req.budget.userId) {
        return res.status(401).json({ error: 'Usuario no autorizado' });
    }
    next();
}