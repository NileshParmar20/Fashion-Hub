import session from "express-session";
import { config } from "dotenv";
import MongoStore from "connect-mongo";

config();

const sessionMiddleware = session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({
        mongoUrl:process.env.MONGO_URI,
        dbName:"Fashion_Hub",
        collectionName:"sessions",
    }),
    cookie:{
        httpOnly:true,
        secure:true,
        maxAge:24*60*60*1000, //1day
    },
    
});

export default sessionMiddleware;