import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/Connection.js";
import router from "./routes/ServiceRoute.js";
dotenv.config();

const app = express();
connectDB();
app.use(
  express.json(
    {
      extended: true,
    },
    urlencoded({ extended: true })
  )
);
app.use(cookieParser());
app.use("/api/v1", router);

const PORT = process.env.PORT || 5000;
app.use("/", (req, res) => {
  res.send("Welcome to the service API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
