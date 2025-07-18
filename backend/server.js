import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/db.js"
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoute.js";
import cors from "cors";
import sessionMiddleware from "./middlewares/session.js";
import passport from "passport";
import "./config/google_login.js";
import googleAuthRoute from "./routes/google-auth.js"; 
import productRoutes from "./routes/productRoute.js"
import cartRoutes from "./routes/cartRoute.js";



const app = express();

config({ path: ".env" });

connectDB();

app.set("view engine", "ejs"); 
app.set("views", "./views"); 

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(cookieParser());

app.use(sessionMiddleware);

app.use(passport.initialize());

app.use(passport.session());

app.use("/auth", googleAuthRoute); 

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/product",productRoutes);

app.use("/api/v1/cart",cartRoutes);


app.use(express.static("public"))


app.get("/",(req,res)=>{
    res.render("auth.ejs");
})
app.get("/", (req, res) => {
    res.status(200).json({ message: "it's working" });
    
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is listing to the port ${port}.`);

})