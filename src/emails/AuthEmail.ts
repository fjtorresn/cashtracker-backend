import { transport } from "../config/nodemailer";

type EmailType = {
    name: string;
    email: string;
    token: string;
}

export class AuthEmail {
    static sendConfirmationEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'demomailtrap.co',
            to: user.email,
            subject: 'CashTracker - Confirma tu cuenta',
            html: `
                <p>Hola ${user.name}, confirma tu cuenta en CashTracker</p>
                <p>Visita el siguiente enlace:</p>
                <a href=#>Confirmar cuenta</a>
                <p> e ingresa el código: <b>${user.token}</b></p>
            `
        })
        console.log(email);
    }

    static sendRecoveryEmail = async (user: EmailType) => {
        const email = await transport.sendMail({
            from: 'demomailtrap.co',
            to: user.email,
            subject: 'CashTracer - Recuperar contraseña',
            html: `
                <p>Hola ${user.name}, para recuperar tu constraseña en CashTracker</p>
                <p>Visita el siguiente enlace:</p>
                <a href=#>Confirmar cuenta</a>
                <p> e ingresa el código: <b>${user.token}</b></p>
            `
        })
        console.log(email);
    }
}