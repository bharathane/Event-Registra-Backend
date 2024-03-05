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

    const mailOptions = {
      from: "mandabharath49@gmail.com",
      to: email,
      subject: "Congractulations| Registration Successfull",
      text: `you registration is successfull. you registration id is ${dbRes.id}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      res.status(200).json({ message: "Email sent", info });
    });
    res.send({ succesMessage: "Booking Successfull" });
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
