var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'smtp.live.com',
  auth: {
    user: 'fuadks@hotmail.com',
    pass: 'ahli1234'
  }
});

var mailOptions = {
  from: 'fuadks@hotmail.com',
  to: 'fuadks@hotmail.com',
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