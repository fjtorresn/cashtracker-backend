import { createRequest, createResponse } from "node-mocks-http"
import { budgets } from "../../mocks/budgets"
import Expense from "../../../models/Expense";
import { ExpensesController } from "../../../controllers/ExpenseController";
import { expenses } from "../../mocks/expense";

jest.mock('../../../models/Expense.ts', () => ({
    create: jest.fn()
}));

describe('ExpenseController.create', () => {
    it('Should create an expense and return 200', async () => {
        const expenseMock = {
            budgetId: 1,
            save: jest.fn().mockResolvedValue(true)
        };

        (Expense.create as jest.Mock).mockResolvedValue(expenseMock);
        const req = createRequest({
            method: 'POST',
            url: '/api/v1/budgets/:budgetId/expenses',
            body: { name: 'Mi gasto', amount: 100000 },
            budget: budgets[0],
        });
        const res = createResponse();

        await ExpensesController.create(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(201);
        expect(data).toEqual('Gasto creado con éxito');
        expect(expenseMock.save).toHaveBeenCalled();
        expect(expenseMock.save).toHaveBeenCalledTimes(1);
        expect(Expense.create).toHaveBeenCalledWith(req.body);
    });

    it('Should handle error when creating and return 500', async () => {
        const expenseMock = {
            budgetId: 1,
            save: jest.fn().mockResolvedValue(true)
        };

        (Expense.create as jest.Mock).mockRejectedValue(new Error);
        const req = createRequest({
            method: 'POST',
            url: '/api/v1/budgets/:budgetId/expenses',
            body: { name: 'Mi gasto', amount: 100000 },
            budget: budgets[0],
        });
        const res = createResponse();

        await ExpensesController.create(req, res);

        const data = res._getJSONData();

        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ message: 'Error al crear el gasto' });
        expect(expenseMock.save).not.toHaveBeenCalled();
        expect(Expense.create).toHaveBeenCalledWith(req.body);
    });
});

describe('ExpenseController.getByID', () => {
    it('Should return the expense with ID 1', async () => {
        const req = createRequest({
            method: 'GET',
            url: '/api/v1/budgets/:budgetId/expenses/:expensesId',
            expense: expenses[0]
        })
        const res = createResponse();

        await ExpensesController.getById(req, res);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual(expenses[0]);
    });
});

describe('ExpenseController.updateByID', () => {
    it('Should update the expense', async () => {
        const expenseMock = {
            ...expenses[0],
            update: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'PUT',
            url: '/api/v1/budgets/:budgetId/expenses/:expensesId',
            body: { name: "Mi gasto", amount: 100000 },
            expense: expenseMock
        })
        const res = createResponse();

        await ExpensesController.updateById(req, res);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual('Expense updated successfully');
        expect(expenseMock.update).toHaveBeenCalled();
        expect(expenseMock.update).toHaveBeenCalledTimes(1);
        expect(expenseMock.update).toHaveBeenCalledWith(req.body);
    });
});

describe('ExpenseController.deleteByID', () => {
    it('Should delete the expense', async () => {
        const expenseMock = {
            ...expenses[0],
            destroy: jest.fn().mockResolvedValue(true)
        }
        const req = createRequest({
            method: 'DELETE',
            url: '/api/v1/budgets/:budgetId/expenses/:expensesId',
            expense: expenseMock
        })
        const res = createResponse();

        await ExpensesController.deleteById(req, res);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(200);
        expect(data).toEqual('Expense deleted successfully');
        expect(expenseMock.destroy).toHaveBeenCalled();
        expect(expenseMock.destroy).toHaveBeenCalledTimes(1);
    });
});