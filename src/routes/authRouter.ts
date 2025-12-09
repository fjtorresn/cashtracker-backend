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
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('email')
        .isEmail().withMessage('Email inválido'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener un largo mínimo de 6 caracteres'),
    handleInputErrors,
    AuthController.createAccount
);

router.post('/confirm-account',
    body('token')
        .isLength({ min: 6, max: 6 }).withMessage('El token debe tener una longitud de 6')
        .notEmpty().withMessage('El token es obligatorio'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('Email inválido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),
    handleInputErrors,
    AuthController.login
);

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Email inválido'),
    handleInputErrors,
    AuthController.forgotPassword
);

router.post('/validate-token',
    body('token')
        .isLength({ min: 6, max: 6 }).withMessage('El token debe tener una longitud de 6 caracteres')
        .notEmpty().withMessage('El token es obligatorio'),
    handleInputErrors,
    AuthController.validateToken
);

router.post('/reset-password/:token',
    param('token')
        .isLength({ min: 6, max: 6 }).withMessage('El token debe tener una longitud de 6 caracteres')
        .notEmpty().withMessage('El token es obligatorio'),
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener un largo mínimo de 6 caracteres'),
    handleInputErrors,
    AuthController.resetPasswordWithToken
);

router.get('/user',
    authenticate,
    handleInputErrors,
    AuthController.user
);

router.post('/update-password',
    authenticate,
    body('current_password')
        .notEmpty().withMessage('La constraseña actual no puede estar vacía'),
    body('new_password')
        .isLength({ min: 6 }).withMessage('La constraseña nueva debe tener un largo mínimo de 6 caracteres'),
    handleInputErrors,
    AuthController.updatePassword
);


export default router;