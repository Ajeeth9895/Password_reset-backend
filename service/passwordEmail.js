const nodemailer = require('nodemailer');
const nodemailergun = require('nodemailer-mailgun-transport');


const passwordEmail = async ({ email, firstName, lastName, message }) => {
  

  const auth = {
    auth: {
      api_key: '634587321a4ab51f0db5a3b29b6c79af-07ec2ba2-42c472ee',
      domain: 'sandbox2a2383916264428798f5b0e90bb59a6c.mailgun.org'
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
