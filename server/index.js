import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import ProductRoutes from "./routes/ProductRoute.js";
import MessageRoutes from "./routes/MessageRoute.js";
import path from "path";
//import { fileURLToPath } from "url";
// config env
dotenv.config();

// Database Config
connectDB();

//esmodule fix
//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

// rest object
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

//app.use(express.static(path.join(__dirname, "../Frontend/build")));

//Routes
// Authentication
app.use("/api/v1/auth", authRoutes);
// Category
app.use("/api/v1/category", categoryRoutes);

// Product
app.use("/api/v1/product", ProductRoutes);

app.use("/api/v1/contact", MessageRoutes);

// app.use("*", function (req, res) {
//  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
// });

app.get("/", (req, res)=>{
  res.send("Home");
})

//Port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
