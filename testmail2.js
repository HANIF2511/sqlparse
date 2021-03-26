var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
//  service: 'mail.gordano.com',
  host: 'mail.gordano.com',
   port: 465,
  auth: {
    user: 'fuadk@gordano.com',
    pass: 'egypt123'
  }
});

var mailOptions = {
  from: 'noreply@zain.com',
  to: 'fuadk@gordano.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log("there is an error:", error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});