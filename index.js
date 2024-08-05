const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 5000;
const pages = require("./src/routes/pages");
const signup = require("./src/routes/signup");
const signin = require("./src/routes/signin");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "complicated",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
  })
);

// Static Middleware
app.use(express.static("public"));

app.use("/", signup);
app.use("/", signin);
app.use("/", pages);

// View Engine Setup
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
