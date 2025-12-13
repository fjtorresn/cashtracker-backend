import { createRequest, createResponse } from "node-mocks-http"
import { validateExpenseExists } from "../../../middlewares/expense";
import Expense from "../../../models/Expense";
import { expenses } from "../../mocks/expense";

jest.mock('../../../models/Expense.ts', () => ({
    findByPk: jest.fn()
}));

describe('Expense Middleware - validateExpenseExists', () => {
    beforeEach(() => {
        (Expense.findByPk as jest.Mock).mockImplementation((id) => {
            const expense = expenses.filter(e => e.id === id)[0] ?? null;
            return Promise.resolve(expense);
        })
    })
    it('Should execute next if expense exists', async () => {
        const expenseMock = expenses[0];
        const req = createRequest({
            params: {
                expenseId: 1
            }
        });
        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req, res, next);

        expect(req.expense).toEqual(expenseMock);
        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('Should handle non-existen expenses', async () => {
        const req = createRequest({
            params: {
                expenseId: 4
            }
        });
        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req, res, next);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'Gasto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    });

    it('Should handle error when connecting to the DB', async () => {
        (Expense.findByPk as jest.Mock).mockRejectedValue(new Error);
        const req = createRequest({
            params: {
                expenseId: 1
            }
        });
        const res = createResponse();
        const next = jest.fn();

        await validateExpenseExists(req, res, next);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: 'Internal Server Error' });
        expect(next).not.toHaveBeenCalled();
    });
})