const express = require("express");
const engines = require("consolidate");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const path = require("path");
const firebase = require("firebase/app");
// const dotenv = require("dotenv");

const functions = require("firebase-functions");
const firebaseAdmin = require("firebase-admin");
const firebaseAuth = require("firebase/auth");
const firebaseConfig = {
  apiKey: "AIzaSyDwpMJEenF-cFHz3fcTPyXYpLN--zOsVP4",
  authDomain: "code-cheat-sheet.firebaseapp.com",
  databaseURL:
    "https://code-cheat-sheet-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "code-cheat-sheet",
  storageBucket: "code-cheat-sheet.appspot.com",
  messagingSenderId: "13760623559",
  appId: "1:13760623559:web:3238cf41dd79aaa7005fe2",
  measurementId: "G-JTHJZS9JPY",
};
firebase.initializeApp(firebaseConfig);

const PORT = 3000;
const app = express();
const publicPath = path.resolve(__dirname, "../public");
app.use(express.static(publicPath));

var hbsHelpers = exphbs.create({
  helpers: require("./helpers/handlebars.js").helpers,
  defaultLayout: "",
  extname: ".hbs",
});
app.engine("hbs", hbsHelpers.engine);

app.set("views", "./views");
app.set("view engine", "hbs");

app.get("/get-me-superman", (request, response) => {
  //   response.send("Hello Superman!");
  response.render("./superman.hbs");
});
app.get("/", (request, response) => {
  //   response.send("Hello Superman!");
  response.render("./index.hbs");
});
app.listen(PORT, () => {
  console.log(`App Listening on http://localhost:${PORT} in your browser`);
});
exports.app = functions.https.onRequest(app);
