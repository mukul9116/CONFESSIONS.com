const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

dotenv.config();

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

const confessionSchema = new mongoose.Schema({
  fromName: String,
  toName: String,
  email: String,
  type: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Confession = mongoose.model("Confession", confessionSchema);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/confess", async (req, res) => {
  try {
    const { fromName, toName, email, type, message } = req.body;
    const newConfession = new Confession({ fromName, toName, email, type, message });
    await newConfession.save();
    res.send(`<h2>✅ Confession submitted successfully!</h2><a href="/">Go Back</a>`);
  } catch (error) {
    res.status(500).send("Error saving confession: " + error.message);
  }
});

app.get("/admin", async (req, res) => {
  const confessions = await Confession.find().sort({ createdAt: -1 });
  res.render("admin", { confessions });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
