import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Budget from '../models/Budget';
import Expense from '../models/Expense';

dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL, {
    models: [__dirname + '/../models/**/*'],
    logging: false,
    dialectOptions: {
        ssl: {
            required: false
        }
    },
})