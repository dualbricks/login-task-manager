const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.EMAIL_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'Admin@chenxinx.me',
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'Admin@chenxinx.me',
        subject: 'Termination of Service',
        text:`We are sad to see you go, ${name}! I hope to see you back some time soon`
    })

}
module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}