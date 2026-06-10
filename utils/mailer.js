const nodemailer = require('nodemailer')

const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}

const smtpConfigured = Boolean(
  smtpConfig.host && smtpConfig.port && smtpConfig.auth.user && smtpConfig.auth.pass && process.env.FROM_EMAIL
)

let transporter = null
if (smtpConfigured) {
  transporter = nodemailer.createTransport({
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465,
    auth: smtpConfig.auth
  })
} else {
  console.warn('SMTP is not configured. Email sending will be logged to the console instead of sent.')
}

async function sendMail({ to, subject, text, html }){
  if (!smtpConfigured || !transporter) {
    console.log('=== DEBUG EMAIL ===')
    console.log('From:', process.env.FROM_EMAIL || 'no-reply@example.com')
    console.log('To:', to)
    console.log('Subject:', subject)
    console.log('Text:', text)
    if (html) console.log('HTML:', html)
    console.log('===================')
    return { accepted: [to], debug: true }
  }
  const info = await transporter.sendMail({ from: process.env.FROM_EMAIL, to, subject, text, html })
  return info
}

module.exports = { sendMail }
