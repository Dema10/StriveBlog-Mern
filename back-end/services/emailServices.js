import mailgun from "mailgun-js";

const mg = mailgun ({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

export const sendEmail = async (to, subject, htmlContent) => {
    const data = {
        from: 'StriveBlog <noreplay@yourdomain.com>',
        to,
        subject,
        html: htmlContent
    };
    try {
        const res = await mg.messages().send(data);
        console.log('email inviata con successo', res);
        return res;
    } catch (err) {
        console.error('errore invio mail', err);
        throw err;
    }
}