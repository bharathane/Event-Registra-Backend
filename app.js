const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "eventsData.db");
const cors = require("cors");
const nodemailer = require("nodemailer");
const app = express();
app.use(cors());
app.use(express.json());

let db;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mandabharath49@gmail.com",
    pass: "ozpp dhlr zhuz uqez",
  },
});
// Establish connection between db and server
const initailizeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at 3000 port");
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

initailizeDbAndServer();

// post events in events tables

app.post("/postEvents/", async (req, res) => {
  try {
    const { username, email, phone, eventType } = req.body;
    const sqlQueryForPost = `insert into events(name,email,phone,eventType)
    values('${username}','${email}','${phone}','${eventType}')`;
    const dbRes = await db.run(sqlQueryForPost);
    const getIdQuery = `select * from events order by id desc limit 1`;
    const getIdForDbRes = await db.all(getIdQuery);
    res.send({ succesMessage: "Booking Successfull" });
    const mailOptions = {
      from: "mandabharath49@gmail.com",
      to: email,
      subject: `Congractulations ${username} ||  Confirmation of Your Event Registration`,
      html: `
    <p>Dear ${username},</p>
    <p>We hope this email finds you well. We are delighted to inform you that your registration for the upcoming ${eventType} has been successfully received and processed. We appreciate your interest in joining us for this exciting event.</p>
    <p><strong>Event Details:</strong></p>

    <p><strong>Your registration details:</strong></p>
    <ul>
      <li>Name: ${username}</li>
      <li>Email: ${email}</li>
      <li>Contact Number: ${phone}</li>
      <li>Registration ID: ${getIdForDbRes[0].id}</li>
    </ul>
    <p>Please make sure to bring a valid ID and the confirmation email with your Registration ID to facilitate a smooth check-in process on the day of the event.</p>
    <p>If you have any questions or need further assistance, feel free to reach out to our event coordinator at mandabharath49@gmail.com or 8247360108.</p>
    <p>We are looking forward to your participation and hope you have a rewarding and enjoyable experience at ${eventType}. Thank you for being a part of this event!</p>
    <p>Best regards,<br>Eligere Technologies<br>Venkata Durga Bharath Manda<br>8247360108</p>
  `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ message: "Email sent", info });
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/getEvents", async (req, res) => {
  try {
    const getSqlquary = `select * from events`;
    const dbResponse = await db.all(getSqlquary);
    res.send({ eventsData: dbResponse });
  } catch (error) {
    console.log(error.message);
  }
});
