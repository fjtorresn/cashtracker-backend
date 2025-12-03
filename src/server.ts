import colors from 'colors';
import morgan from 'morgan';
import express from 'express';
import { db } from './config/db';
import routerBudget from './routes/budgetRouter';

async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        console.log(colors.blue.bold('Database connected successfully'));
    } catch (error) {
        console.log(colors.blue.bold('Database connection failed'));
    }
}

connectDB();

const app = express();

app.use(morgan('dev'));

app.use(express.json());

app.use('/api/v1/budgets', routerBudget);

export default app;