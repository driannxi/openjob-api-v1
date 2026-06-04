import "dotenv/config";
import express from "express";
import routes from "../routes/index.js";
import ErrorHandler from "../middlewares/error.js";
import documentRouter from "../services/documents/routes/index.js";

const app = express();
app.use(express.json());
app.use(routes);
app.use(documentRouter);
app.use(ErrorHandler);

export default app;
