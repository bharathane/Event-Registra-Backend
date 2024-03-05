const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const dbPath = path.join(__dirname, "eventsData.db");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let db;

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
    res.send({ succesMessage: "Booking Successfull" });
  } catch (error) {
    console.log(error.message);
  }
});
