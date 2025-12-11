import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";
import { handleInputErrors } from "../middlewares/validation";
import { validateBudgetExists, validateBudgetId, validateBudgetInputs, hasAccess } from "../middlewares/budget";
import { ExpensesController } from "../controllers/ExpenseController";
import { validateExpenseExists, validateExpenseId, validateExpenseInputs } from "../middlewares/expense";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(authenticate);

router.param('budgetID', validateBudgetId);
router.param('budgetID', validateBudgetExists);
router.param('budgetID', hasAccess);


router.param('expenseID', validateExpenseId);
router.param('expenseID', validateExpenseExists);

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

/* Routes for expenses */

router.post('/:budgetID/expenses',
    validateExpenseInputs,
    handleInputErrors,
    ExpensesController.create
);

router.get('/:budgetID/expenses/:expenseID',
    handleInputErrors,
    ExpensesController.getById
);

router.put('/:budgetID/expenses/:expenseID',
    validateExpenseInputs,
    handleInputErrors,
    ExpensesController.updateById
);

router.delete('/:budgetID/expenses/:expenseID',
    handleInputErrors,
    ExpensesController.deleteById
);

export default router;
