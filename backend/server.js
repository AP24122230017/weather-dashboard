const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const routes = require("./routes/weather");

const app = express();

app.use(cors());
app.use(express.json());
app.use(compression());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(console.error);

app.use("/api/weather", routes);

app.listen(process.env.PORT, () =>
  console.log(`Server running on ${process.env.PORT}`)
);