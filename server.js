process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

//import modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const admin = require('firebase-admin')

//create a new Express app instance 
const app = express();

//initialize the Firebase Admin SDK using private key
const serviceAccount = require('./serviceAccountKey.json')
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//accept CORS requests and parse request body into JSON
app.use(cors({origin: "*"}));
app.use(bodyParser.json());

//start application server on port 3000
app.listen(3000, () => {
  console.log("The server started on port 3000");
});

// define a sendmail endpoint
app.post("/send-email", (req, res) => {
  console.log("email request came");
  let data = req.body;
  sendEmail(data, (err, info) => {
    if(err) {
      console.log(err);
      res.status(400);
      res.send({error: "Failed to send email"});
    }
    else {
      console.log("Email has been sent");
      res.send(info);
    }
  });
});

// sendmail function
async function sendEmail(data, callback) {
  // send email as onshoringportal@gmail.com
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "onshoringportal@gmail.com",
      pass: "Agecare123"
    }
  });

  // context of the email
  const mailOptions = {
    from: `"Onshoring ACP" <onshoringportal@gmail.com>`,
    to: data.email,
    subject: data.subject,
    text: data.text
  };
  
  transporter.sendMail(mailOptions, callback);
}

// define a delete auth user endpoint
app.post("/delete-auth-user-fb", (req, res) => {
  console.log("delete request came");
  let data = req.body;
  deleteAuthUser(data.email, (err, info) => {
    if(err) {
      console.log(err);
      res.status(400);
      res.send({error: "Failed to delete"});
    }
    else {
      console.log("User has been deleted");
      res.send(info);
    }
  });
});

// delete auth user function by email
async function deleteAuthUser(email) {
  admin.auth().getUserByEmail(email).then((userRecord) => {
    admin.auth().deleteUser(userRecord.uid).then(function() {
      console.log('Successfully deleted user');
    })
    .catch(function(error) {
      console.log('Error deleting user:', error);
    });
  })
  .catch(function(error) {
    console.log('Error fetching user data:', error);
  });
}
