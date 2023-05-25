const nodemailer = require('nodemailer');
const nodemailergun = require('nodemailer-mailgun-transport');

require('dotenv').config()

const passwordEmail = async ({ email, firstName, lastName, message }) => {
  

  const auth = {
    auth: {
      api_key: process.env.APIKEY,
      domain: process.env.DOMAIN
    }
  }


  let transporter = nodemailer.createTransport(nodemailergun(auth));

  const mailOptions = {
    from: 'ajeevishnu2026@gmail.com',
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

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      console.log('Error' + err);
    } else {
      console.log('Email send');
    }
  })


}

module.exports =  {passwordEmail} 
