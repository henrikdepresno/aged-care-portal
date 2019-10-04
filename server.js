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

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/aged-care-portal'));

app.get('/*', (req, res) => {   
  res.sendFile(path.join(__dirname +'/dist/aged-care-portal/index.html'));
});

//start application server on port 8080
app.listen(process.env.PORT || 8080, () => {
  console.log("The server started on port 8080");
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
  const emailSender = require('./emailPasswordACP.json');

  // send email
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: emailSender.email,
      pass: emailSender.password
    }
  });

  // context of the email
  const mailOptions = {
    from: `"Onshoring ACP" <${emailSender.email}>`,
    to: data.email,
    subject: data.subject,
    text: data.text
  };
  
  transporter.sendMail(mailOptions, callback);
}

// define a add auth user endpoint
app.post("/add-auth-user-fb", (req, res) => {
  console.log("add request came");
  let data = req.body;
  addAuthUser(data.email, data.password, (err, info) => {
    if(err) {
      console.log(err);
      res.status(400);
      res.send({error: "Failed to add"});
    }
    else {
      console.log("User has been added");
      res.send(info);
    }
  });
});

// add auth user function by email
async function addAuthUser(email, password) {
  admin.auth().createUser({
    email: email,
    emailVerified: true,
    password: password
  }).then(function(userRecord) {
    console.log('Successfully created new auth user:', userRecord.uid);
  })
  .catch(function(error) {
    console.log('Error deleting user:', error);
  });
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
