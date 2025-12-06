import type { Request, Response } from 'express';
import Budget from '../models/Budget';
import Expense from '../models/Expense';

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        try {
            // Obtener todos los budgets de la DB
            const budgets = await Budget.findAll({
                order: [
                    ['createdAt', 'DESC']
                ],
                // TODO: filtrar por usuario autenticado
            });
            // Devoolverlos en la respuesta
            res.status(200).json(budgets);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static create = async (req: Request, res: Response) => {
        try {
            const budget = new Budget(req.body);
            await budget.save();
            res.status(201).json(budget);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static getBudgetById = async (req: Request, res: Response) => {
        const budget = await Budget.findByPk(req.budget.id, {
            include: [Expense]
        });
        res.status(200).json(budget);
    }

    static updateBudgetById = async (req: Request, res: Response) => {
        await req.budget.update(req.body);
        res.status(200).json("Budget updated successfully");
    }

    static deleteBudgetById = async (req: Request, res: Response) => {
        await req.budget.destroy();
        res.status(200).json("Budget deleted successfully");
    }
}