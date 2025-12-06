import { Router } from "express";
import { body, param } from "express-validator";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import { validateBudgetExists, validateBudgetId, validateBudgetInputs } from "../middlewares/budget";

const router = Router();

router.param('budgetID', validateBudgetId);
router.param('budgetID', validateBudgetExists);

router.get('/', BudgetController.getAll);

router.post('/',
    validateBudgetInputs,
    handleInputErrors,
    BudgetController.create
);

router.get('/:budgetID',
    handleInputErrors,
    BudgetController.getBudgetById
);

router.put('/:budgetID',
    validateBudgetInputs,
    handleInputErrors,
    BudgetController.updateBudgetById
);

router.delete('/:budgetID',
    handleInputErrors,
    BudgetController.deleteBudgetById
);

export default router;
