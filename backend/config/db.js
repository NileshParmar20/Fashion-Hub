import mongoose, { connect } from "mongoose";

export const connectDB = ()=>{
    mongoose
    .connect(process.env.MONGO_URI, {
        dbName: "Fashion_Hub",
    })
    .then(() => {console.log("MongoDB connected!...")})
    .catch((err) => {console.log(err)});
}
