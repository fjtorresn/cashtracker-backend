import type { Request, Response } from 'express';
import Budget from '../models/Budget';

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
            // Crear budget
            const budget = new Budget(req.body);
            // Guardar en la base de datos
            await budget.save();
            res.status(201).json(budget);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static getBudgetById = async (req: Request, res: Response) => {
        try {
            // Buscar filtrando por el ID
            const budget = await Budget.findByPk(req.params.id);
            if (!budget) {
                const error = new Error("Budget not found");
                return res.status(404).json({ error: error.message });
            }
            res.status(200).json(budget);
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static updateBudgetById = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.findByPk(req.params.id);
            if (!budget) {
                const error = new Error("Budget not found");
                return res.status(404).json({ error: error.message });
            }
            await budget.update(req.body);
            res.status(200).json("Budget updated successfully");
        } catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    static deleteBudgetById = async (req: Request, res: Response) => {
        try {
            const budget = await Budget.findByPk(req.params.id);
            if (!budget) {
                const error = new Error("Budget not found");
                return res.status(404).json({ error: error.message });
            }
            await budget.destroy();
            res.status(200).json("Budget deleted successfully");
        } catch (error) {

        }
    }
}