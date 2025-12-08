import { Router } from "express";
import { body, param } from 'express-validator';
import { AuthController } from "../controllers/AuthController";
import { handleInputErrors } from "../middlewares/validation";
import { limiter } from "../config/limiter";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.use(limiter);

router.post('/create-account',
    body('name')
        .notEmpty().withMessage('Name is required'),
    body('email')
        .isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token')
        .isLength({ min: 6, max: 6 }).withMessage('Token must be 6 characters long')
        .notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('Invalid email address'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    handleInputErrors,
    AuthController.login
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Invalid email address'),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .isLength({ min: 6, max: 6 }).withMessage('Token must be 6 characters long')
        .notEmpty().withMessage('Token is required'),
    handleInputErrors,
    AuthController.validateToken
);

router.post('/reset-password/:token',
    param('token')
        .isLength({ min: 6, max: 6 }).withMessage('Token must be 6 characters long')
        .notEmpty().withMessage('Token is required'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
);

router.get('/user',
    authenticate,
    AuthController.user
);


export default router;