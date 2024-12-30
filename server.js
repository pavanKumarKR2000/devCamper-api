const express = require("express");
const dotenv = require("dotenv");
// const logger = require("./middlewares/logger");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");
const fileupload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

/** bootcamp router */
const bootcamps = require("./routes/bootcamps");
/** course router */
const courses = require("./routes/courses");
/** auth router */
const auth = require("./routes/auth");
/** users router */
const users = require("./routes/users");
/** reviews router */
const reviews = require("./routes/reviews");

const errorHandler = require("./middlewares/error");

/**  load the envs */
dotenv.config({ path: "./config/config.env" });

/** connect to the database */
connectDB();

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://dev-camper-frontend-9kg8g4sqc-pavankumarkr2000s-projects.vercel.app/auth/login",
];

/** cors middleware */
// CORS middleware configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true); // Allow the request
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

/** json body middleware */
app.use(express.json());

/** swagger  */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use(logger);

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

/** file upload middleware */
app.use(fileupload());

/** sanitize data */
app.use(mongoSanitize());

/** cookie parser */
app.use(cookieParser());

/** set static folder */
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);
app.use("/api/v1/auth", auth);
app.use("/api/v1/users", users);
app.use("/api/v1/reviews", reviews);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});

/** handle unhandled promise rejections */
process.on("unhandledRejection", (error, promise) => {
  console.log(`Error ${error.message}`);

  /** close server and exit */
  server.close(() => process.exit(1));
});
