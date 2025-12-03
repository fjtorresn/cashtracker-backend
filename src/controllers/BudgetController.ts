import type { Request, Response } from 'express';

export class BudgetController {
    static getAll = async (req: Request, res: Response) => {
        console.log('GET getAll');
    }

    static create = async (req: Request, res: Response) => {
        console.log('POST create');
    }

    static getBudgetById = async (req: Request, res: Response) => {
        console.log('GET getBudgetById');
    }

    static updateBudgetById = async (req: Request, res: Response) => {
        console.log('PUT updateBudgetById');
    }

    static deleteBudgetById = async (req: Request, res: Response) => {
        console.log('DELETE deleteBudgetById');
    }
}