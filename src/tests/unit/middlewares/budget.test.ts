import { createRequest, createResponse } from "node-mocks-http"
import { hasAccess, validateBudgetExists } from "../../../middlewares/budget";
import Budget from "../../../models/Budget";
import { budgets } from "../../mocks/budgets";

jest.mock('../../../models/Budget', () => ({
    findByPk: jest.fn()
}));

describe('Budget Middleware - validateBudgetExists', () => {
    it('Should handle non-existent budget', async () => {
        (Budget.findByPk as jest.Mock).mockResolvedValue(null);
        const req = createRequest({
            params: { budgetId: 1 }
        })
        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req, res, next);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(404);
        expect(data).toEqual({ error: 'Presupuesto no encontrado' });
        expect(next).not.toHaveBeenCalled();
    });

    it('Should proceed to next middleware if budget', async () => {
        const budgetMock = budgets[0];
        (Budget.findByPk as jest.Mock).mockResolvedValue(budgetMock);
        const req = createRequest({
            params: { budgetId: 1 }
        })
        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req, res, next);

        expect(req.budget).toEqual(budgetMock);
        expect(next).toHaveBeenCalled();
    })

    it('Should handle error and return 500', async () => {
        (Budget.findByPk as jest.Mock).mockRejectedValue(new Error);
        const req = createRequest({
            params: { budgetId: 1 }
        })
        const res = createResponse();
        const next = jest.fn();

        await validateBudgetExists(req, res, next);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(500);
        expect(data).toEqual({ error: 'Internal Server Error' });
    })
});

describe('Budget Middleware - hasAccess', () => {
    it('Should execute next if the user has access', () => {
        const req = createRequest({
            user: { id: 1 },
            budget: budgets[0]
        })
        const res = createResponse();
        const next = jest.fn();
        hasAccess(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(next).toHaveBeenCalledTimes(1);
    });

    it('Should return 401 if the user does not have access', () => {
        const req = createRequest({
            user: { id: 2 },
            budget: budgets[0]
        })
        const res = createResponse();
        const next = jest.fn();
        hasAccess(req, res, next);

        const data = res._getJSONData();
        expect(res.statusCode).toBe(401);
        expect(data).toEqual({ error: 'Usuario no autorizado' })
        expect(next).not.toHaveBeenCalled();
    });
});