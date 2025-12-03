import { Router } from "express";
import { BudgetController } from "../controllers/BudgetController";

const router = Router();

router.get('/', BudgetController.getAll);
router.get('/:id', BudgetController.getBudgetById);
router.post('/', BudgetController.create);
router.put('/:id', BudgetController.updateBudgetById);
router.delete('/:id', BudgetController.deleteBudgetById);

export default router;
