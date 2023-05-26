const nodemailer = require('nodemailer');

require('dotenv').config()

const passwordEmail = async ({ email, firstName, lastName, message }) => {

  let mailTranspoter = nodemailer.createTransport({
    service: "gmail",
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.USER,
      pass: process.env.PASSWORD
    }
  })

  let details = {
    from: process.env.USER,
    to: `${email}`,
    subject: "Reset password",
    html: ` <div style="background-color: antiquewhite; margin-left:25%; margin-right:25%; padding:20px;">
      <div>
        <b>Hello ${firstName} ${lastName},</b>
      </div>
      <br>
      <br>
      <div>
        Expires in 30 mins-${message}
      </div>
      <br>
      <footer style="text-align: center;">
        <b>Thank you</b>
      </footer>
    </div>`
  }


  mailTranspoter.sendMail(details, (err) => {
    if (err) {
      console.log('Email not send' + err);
    } else {
      console.log('Email send');
    }
  })

}

module.exports = { passwordEmail } 
