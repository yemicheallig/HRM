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
const myaccount = require("./src/routes/myaccount");
const changepwd = require("./src/routes/changepwd");
const deleteFunction = require("./src/routes/delete");

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
app.use("/", myaccount);
app.use("/", changepwd);
app.use("/", deleteFunction);
app.get("*", (req, res) => {
  res.send(
    `<div style='height:100vh;width:100%;display:flex;flex-direction:column;justify-content:center'><h1 style='text-align:center;margin-bottom:30px'>404 Page Not Found</h1><a href='/' style='text-align:center'>Home</a></div>`
  );
});

// View Engine
app.set("views", "./src/views");
app.set("view engine", "ejs");

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
