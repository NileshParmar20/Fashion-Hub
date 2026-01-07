// 1. First, import and initialize dotenv
import { config } from "dotenv";
config({ path: ".env" }); 

// 2. Now import express and other external libraries
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

// 3. Finally, import your local files that depend on environment variables
import { connectDB } from "./config/db.js";
import "./config/google_login.js"; // This will now correctly find process.env variables
import userRoutes from "./routes/userRoute.js";
import googleAuthRoute from "./routes/google-auth.js";
import productRoutes from "./routes/productRoute.js";
import cartRoutes from "./routes/cartRoute.js";

const app = express();


// Database Connection
connectDB();

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", "./views");

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(express.static("public"));

// Routes
app.use("/auth", googleAuthRoute);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);

app.get("/health", (req, res) => {
    res.status(200).json({ status: "active", message: "Fashion Hub API is working" });
});

// Global Error Handling Middleware
// This catches any error thrown in the app so you don't need logic in every controller
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "development" ? err.stack : null,
    });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});