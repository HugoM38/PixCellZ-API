import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import pixcellRoutes from "./routes/pixcellRoutes";
import dotenv from "dotenv";
import cors from "cors";
import errorHandler from "./middlewares/errorHandler";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/pixcells", pixcellRoutes);
app.use("/api/users", userRoutes);

const dbURI = process.env.NODE_ENV === 'test'
    ? process.env.MONGODB_TEST_URI
    : process.env.MONGODB_URI;

mongoose
    .connect(dbURI as string)
    .then(() => {
        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        } else {
            console.log("Connected to Test MongoDB");
        }
    })
    .catch((err) => console.log(err));

app.use(errorHandler);

export {app, PORT};
