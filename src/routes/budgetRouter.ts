import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import { validateBudgetId } from "../middlewares/budget";

const router = Router();

router.get('/', BudgetController.getAll);

router.post('/',
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('amount')
        .notEmpty().withMessage('El monto es obligatorio')
        .isNumeric().withMessage('El monto debe ser un número decimal')
        .custom(value => value > 0).withMessage('El monto debe ser un número positivo'),
    handleInputErrors,
    BudgetController.create
);

router.get('/:id',
    validateBudgetId,
    handleInputErrors,
    BudgetController.getBudgetById
);

router.put('/:id',
    validateBudgetId,
    body('name')
        .notEmpty()
        .withMessage('El nombre no puede estar vacío'),
    body('amount')
        .notEmpty().withMessage('El monto es obligatorio')
        .isNumeric().withMessage('El monto debe ser un número decimal')
        .custom(value => value > 0).withMessage('El monto debe ser un número positivo'),
    handleInputErrors,
    BudgetController.updateBudgetById);

router.delete('/:id',
    validateBudgetId,
    handleInputErrors,
    BudgetController.deleteBudgetById);

export default router;
