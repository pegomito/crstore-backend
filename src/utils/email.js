
import nodemailer from 'nodemailer';
import 'dotenv/config';

async function sendMail(to, name, body, subject) {

    const smtp = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: "b.pegoraro@unochapeco.edu.br" , 
            pass: "gvie cieo svvn yyct" 

        }
    });

    await smtp.sendMail({
        to,
        subject,
        html: 
            `<h1>Olá ${name}</h1>
            <p>${body}</p>  
            <p>Atenciosamente,</p>
            <p>Loja dos Guri
            </p>
            `
    });

}

export default sendMail;