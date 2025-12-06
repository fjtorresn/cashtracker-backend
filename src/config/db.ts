import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Budget from '../models/Budget';
import Expense from '../models/Expense';

dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL, {
    models: [Budget, Expense],
    dialectOptions: {
        ssl: {
            required: false
        }
    },
})