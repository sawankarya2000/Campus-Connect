const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../config/config.env` });

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.from = process.env.EMAIL_FROM;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sendgrid
      return nodemailer.createTransport({
        service: 'SendinBlue',
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASSWORD,
        },
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(subject, body) {
    // 2) Define email
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: body,
      // html:
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(
      'Welcome',
      'Welcome to Campus Connect.Connect with your campus'
    );
  }

  async sendPasswordReset(link) {
    await this.send(
      'Your password reset token (valid for only 10 minutes)',
      `Click on this link to reset your password: ${link}`
    );
  }
};
