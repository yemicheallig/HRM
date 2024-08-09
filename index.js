const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const app = express();
const PORT = process.env.PORT || 5000;
const pages = require("./src/routes/pages");
const signup = require("./src/routes/signup");
const signin = require("./src/routes/signin");
const addTask = require("./src/routes/addTask");
const addJob = require("./src/routes/addJobs");
const editTask = require("./src/routes/editTask");
const editJob = require("./src/routes/editJob");

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
app.use("/", addTask);
app.use("/", addJob);
app.use("/", editTask);
app.use("/", editJob);

// View Engine Setup
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
