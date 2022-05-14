require('dotenv').config();
const nodemailer = require('nodemailer');

async function sendVerifyEmail(message, creator, profile_pic, mail) {
  console.log('begin-sendVerifyEmail-util:');
  await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'buymeboba.today@gmail.com',
      pass: process.env.GMAIL_PSW, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Buy Me Boba" <buymeboba.today@gmail.com>', // sender address
    to: mail, // list of receivers
    subject: `Recieve a new message from creator ${creator}`, // Subject line
    html: `
    <img src="https://buymeboba.s3.ap-southeast-1.amazonaws.com/asset/button/blackBtn.png" class="p-5" style="width: 350px"><br>
    <b><h2>Hello! you got a new message from ${creator}!</h2><br><br>
        <div style="
        display: flex;
        padding: 5px 20px 5px 10px;
        background-color: #fff;
        border-radius: 12px;
        border: 2px solid #efefef;
        margin-bottom: 100px;
        width: fit-content;
       "><img src=${profile_pic} style="width: 50px;
       border-radius: 50%;
       margin-right: 15px;
       object-fit:cover;
       object-position:center;">
        <h4>: "${message}"</h4></div>
        <p>Wish You Have a great day!</p></br>
        <a href='https://buymeboba.today/'><p>From buymeboba.today</p></a></br>`, // html body
  });
  console.log(info);
}
module.exports = { sendVerifyEmail };
