const nodemailer = require('nodemailer')

class Mailer {
  constructor(options) {
    // Create a SMTP transporter object
    this._transporter = nodemailer.createTransport(options.config)

    this._description = {
      name: 'mailer',
      icon: 'assets/icons/email-icon.png',
      description: 'Send emails'
    }
  }

  send(mailOptions) {
    return new Promise((resolve, reject) => {
      this._transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err)
        } else {
          resolve(info)
        }
      })
    })
  }
}

module.exports = Mailer
