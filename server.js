/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const path = require("path")
const utilities = require('./utilities/');
const baseController = require("./controllers/baseController");
const inventoryRoute = require('./routes/inventoryRoute');
const { title } = require("process")

// View Engine and Templates
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("views", path.join(__dirname, "views"))
app.set("layout", "layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)
// Index Route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory Route
app.use("/inv", inventoryRoute);

app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' })
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// app.use(async (err, req, res, next) => {
//   let nav = await utilities.getNav();
//   console.error(`Error at: "${req.originalUrl}": ${err.message}`);
//   if (err.status == 404) { message = err.message } else { message = 'Oh no! There was a crash. Maybe try a different route?' };
//   res.render("errors/error", {
//     title: err.status || 'Server Error',
//     message,
//     nav
//   });
// });
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}" - Status: ${err.status || 500} - Message: ${err.message}`);
  if (err.status == 404) {
    message = err.message;
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }

  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on http://${host}:${port}`)
})
