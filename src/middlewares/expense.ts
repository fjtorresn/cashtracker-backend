import { Request, Response, NextFunction } from "express";
import { body, param, validationResult } from "express-validator";
import Expense from "../models/Expense";

declare global {
    namespace Express {
        interface Request {
            expense?: Expense;
        }
    }
}

export const validateExpenseInputs = async (req: Request, res: Response, next: NextFunction) => {
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

export const validateExpenseId = async (req: Request, res: Response, next: NextFunction) => {
    await param('expenseId')
        .isInt().withMessage('ID no válido')
        .custom(value => value > 0).withMessage('ID no válido')
        .run(req);

    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

export const validateExpenseExists = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expense = await Expense.findByPk(req.params.expenseId);
        if (!expense) {
            const error = new Error('Gasto no encontrado');
            return res.status(404).json({ error: error.message });
        }
        req.expense = expense;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}