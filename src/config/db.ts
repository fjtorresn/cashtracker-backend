import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import Budget from '../models/Budget';

dotenv.config();

export const db = new Sequelize(process.env.DATABASE_URL, {
    models: [Budget],
    dialectOptions: {
        ssl: {
            required: false
        }
    },
})