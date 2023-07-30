const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = (require('body-parser'));
const nodemailer = require("nodemailer");
require('dotenv').config();
const path = require('path');

// server used to send send emails
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, '../build')));
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));
app.use(bodyParser.json())

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASS          // this app pass will change everytime you change gmail pass. beware.  
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.firstName + req.body.lastName;
  const email = req.body.email;
  const message = req.body.message;
  const phone = req.body.phone;
  const mail = {
    from: name,
    to: process.env.EMAIL_ADDRESS,
    subject: "Portfolio - Contact Form",
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Phone: ${phone}</p>
           <p>Message: ${message}</p>`,
  };
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});

app.get('*', (req,res) => {
  res.sendFile(path.resolve(__dirname, '../build', 'index.html'));
})